/**
 * Created by cristianfelix on 2/3/16.
 */
import elasticsearch from 'elasticsearch';
import _ from 'lodash';
import Immutable from 'immutable'
import {stopWords} from '../config/stopWords';
import Compiler from './Compiler';

export function sortOrdinal(name, data) {
    let sentiment = ["Very Positive", "Positive", "Neutral", "Polarized", "negative", "Very Negative"];
    if(name.indexOf("sentiment") > -1) {
        data.sort((a,b) => sentiment.indexOf(a.key) - sentiment.indexOf(b.key))
    }
    return data;
}

export function getDefaultOperation(op) {
    switch (op) {
        case "QUANTITATIVE": return "in";
        case "DATE": return "between";
        case "CONTINUOUS": return "between";
        case "CATEGORICAL": return "in";
        case "TEXT": return "contains";
        case "BOOLEAN": return "is";
    }
}

export function getDefaultSegmentOrder(type) {
    switch (type) {
        case "CATEGORICAL": return { "_count": "desc" };
        case  "TEXT": return { "_term": "asc" };
        case  "QUANTITATIVE": return {"_key": "asc"};
        case  "CONTINUOUS": return {"_key": "asc"};
        case  "DATE": return {"_key": "desc"};
        case  "BOOLEAN": return {};
    }
}

export default class API {
    constructor(host, index, type, mainText, ignore, password, customMapping) {
        host = password ? "user:" + password + "@" + host : host;
        this.client = new elasticsearch.Client({
            host: host,
            apiVersion: "2.0",
            requestTimeout: 3000000
        });
        this.index = index;
        this.ignore = ignore;
        this.customMapping = customMapping;
        this.type = type;
        this.ready = false;
        this.previousConfig = Immutable.fromJS({});
        this.mainText = mainText;
        this.loaded = this.loadMetadata().then((result) => {
            this.ready = true;
            this.getFieldList().filter((field) => field.key.indexOf("$nlp") == 0).forEach(field => {
                if(field.key.indexOf("beginChar") > -1 || field.key.indexOf("endChar") > -1 ) {
                    this.ignore.push(new RegExp("\\" + field.key.replace("\\.","\\.")))
                }
                if(field.key.indexOf("tokens") > -1 || field.key.indexOf("keyphrases") > -1) {
                    this.customMapping[field.key] = "TEXT"
                }
            })
            this.compiler = new Compiler(this);
            return result;
        });
    }

    loadMetadata() {
        return this.client.indices.getMapping({index: this.index, type: this.type}).then(result => {
            this.metadata = result[this.index].mappings[this.type].properties;
            console.log(Object.keys(this.metadata).filter(key => {
                if(this.metadata[key].type == "string" && !(this.metadata[key].analyzer || this.metadata[key].index)) {
                     return true;
                }
                return false;
            }).map(key => `/${key}/`).join(", \n"));
            let numericFields = this.getFieldList()
                .map((f) => f.key)
                .filter((f) =>
                this.getType(f) === "QUANTITATIVE" ||
                this.getType(f) === "CONTINUOUS" ||
                this.getType(f) === "DATE");
            return this.getStats(numericFields);
        });
    }

    getStats(fields) {
        let query = {"size":0, "aggs": {}};
        fields.forEach(field => {
            if(this.getType(field) === "DATE") {
                query.aggs[field + ".min"] = {"min": {"field": field}};
                query.aggs[field + ".max"] = {"max": {"field": field}};
            } else {
                query.aggs[field] = {"stats": {"field": field}};
            }
        });

        return this.call(query).then((result) => {
            this.numDocs = result.hits.total;
            for(let field of this.getFieldList()) {
                if(result.aggregations[field.key]){
                    field.stats = result.aggregations[field.key];
                } else if(result.aggregations[field.key + '.min']){
                    field.stats = {
                        min: result.aggregations[field.key + ".min"].value,
                        max: result.aggregations[field.key + ".max"].value
                    };
                }
            }
        });
    }

    getFieldList(obj = this.metadata, path = "") {
        let list = [];
        for (let m in obj) {
            if (obj.hasOwnProperty(m)) {
                if (obj[m].properties) {
                    let children = this.getFieldList(obj[m].properties, path + (path !== "" ? "." : "") + m);
                    list = [...list, ...children]
                } else {
                    obj[m].key = path + (path !== "" ? "." : "") + m;
                    list = [...list, obj[m]]
                }
            }

        }
        if (this.ignore) {
            return list.filter((v) => {
                for (let rule of this.ignore) {
                    if (rule.exec(v.key)) {
                        return false;
                    }
                }
                return true;
            });
        } else {
            return list;
        }

    }

    getType(field) {
        if(!field) { return undefined; }
        let localName =  field;
        field = field.replace(/\./g, ".properties.");
        
        if(this.customMapping && this.customMapping[localName]) {
            return this.customMapping[localName];
        }
        let fieldInfo = _.get(this.metadata, field);
        switch (fieldInfo.type) {
            case "string":
                if(fieldInfo.index &&  fieldInfo.index === "not_analyzed"){
                    return "CATEGORICAL";
                } else {
                    return "TEXT"
                }
            case "long":
            case "integer":
            case "short":
            case "byte":
                return "QUANTITATIVE";
            case "double":
            case "float":
                return "CONTINUOUS";
            case "date":
                return "DATE";
            case "boolean":
                return "BOOLEAN";
            case "binary":
                return "BINARY";
            case "geo_point":
                return "GEO";
            case "geo_shape":
                return "GEO_SHAPE"
        }

        return undefined;
    }

    getFieldInfo(field) {
        field = field.replace(/\./g, ".properties.");
        return _.get(this.metadata, field);
    }

    call(body) {
        return this.client.search({
            index: this.index,
            type: this.type,
            body: body
        });
    }

    query(query, options, s3Query) {
        if(!query) {
            return Promise.resolve(undefined);
        }
        let next = query.next;

        delete query.next;
        return this.call(query).then(result => this.clean(result, options, query, s3Query, next));
    }

    cleanSegment(result, options, query, s3Query, next) {
        let segment = undefined;
        if (result.aggregations && result.aggregations.global && result.aggregations.global.segment) {
            let segmentData = result.aggregations.global.segment;

            segment = segmentData.buckets.map(s => {
                return {
                    key: s.key_as_string || s.key,
                    dateValue: s.key_as_string ? s.key : undefined,
                    overall: s.doc_count,
                    selected: s.selected ? s.selected.doc_count : undefined,
                    proportion: s.selected ? s.selected.doc_count/s.doc_count : undefined
                }
            });

            if( result.aggregations.global.merged) {
                let merges = result.aggregations.global.merged.buckets;
                let mergeConf = s3Query.getIn(["segment", "merge"]);

                if (merges) {
                    mergeConf.forEach(m => {
                        //Find the First
                        let idx = segment.findIndex(s => m.get("keys").contains(s.key));
                        let merged = merges[m.get("label")];
                        merged = {
                            key: m.get("label"),
                            dateValue: undefined,
                            overall: merged.doc_count,
                            selected: merged.selected ? merged.selected.doc_count : undefined,
                            proportion: merged.selected ? merged.selected.doc_count/merged.doc_count : undefined,
                            children: []
                        };

                        merged.children.push(segment.splice(idx, 1, merged)[0]);

                        //Remove the rest;
                        idx = segment.findIndex(s => m.get("keys").contains(s.key));
                        while (idx > -1) {
                            merged.children.push(segment.splice(idx, 1)[0]);
                            idx = segment.findIndex(s => m.get("keys").contains(s.key));
                        }
                    })
                }
            }
        }
        return segment;
    }

    cleanSummary(result, options, query, s3Query, next) {

        let summary = {};

        if (result.aggregations && result.aggregations.summary) {
            //Numeric data
            let summaryData = result.aggregations.summary;

            summary = summaryData.buckets.map(s => {
                return {
                    key: s.key_as_string || s.key,
                    dateValue: s.key_as_string ? s.key : undefined,
                    count: s.doc_count,
                    score: s.score,
                    segment: s.segment ? s.segment.doc_count :s.doc_count,
                    overall: s.doc_count,
                    proportion: s.segment ? s.segment.doc_count / s.doc_count  : undefined
                }
            });

        }

        if (result.aggregations && result.aggregations.global && result.aggregations.global.summary) {
            //Categorical and Text
            summary = result.aggregations.global.summary.buckets.map(s => {
                return {
                    key: s.key_as_string || s.key,
                    dateValue: s.key_as_string ? s.key : undefined,
                    overall: s.doc_count,
                    score: s.score,
                    segment: s.segment ? s.segment.doc_count : undefined,
                    proportion: s.segment ? s.segment.doc_count / s.doc_count : undefined
                }
            });
        }
        
        return summary;
    }

    clean(result, options, query, s3Query, next) {
        try {
            let documents = result.hits.hits.map(d => {
                return Object.assign({ highlight: d.highlight ? d.highlight[this.mainText] : undefined, _id: d._id }, d._source)
            });
            let count = result.hits.total;
            let segment = this.cleanSegment(result, options, query, s3Query, next);
            let summary = this.cleanSummary(result, options, query, s3Query, next);

            let res = { documents, count, result, segment, summary, options };

            if(next) {
                let {nextQuery, nexOptions, nextS3Query} = next.map(res);
                return this.query(nextQuery, nexOptions, nextS3Query)
                    .then(nextResult => next.merge(res, nextResult));
            }


            return res;
        } catch(ex) {
            console.error("Problem in cleaning data", result);
            console.trace(ex)
        }
        return undefined;
    }

    execute(s3Query, options) {
        let compile = this.compiler.compile.bind(this.compiler);
        let query = compile(s3Query, options);
        return this.query(query, options, s3Query);
    }
}