/**
 * Created by cristianfelix on 12/26/15.
 */
import elasticsearch from 'elasticsearch';
import _ from 'lodash';
import Immutable from 'immutable'
import {stopWords} from './config/stopWords';
import {newSelectData, newSegmentData, newSummaryData,newDocumentsData} from './reducers'

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
        console.log("api.js",35, customMapping)
        host = password ? "user:" + password + "@" + host : host;
        this.client = new elasticsearch.Client({
            host: host,
            apiVersion: "2.0",
            requestTimeout: 3000000
        });
        this.index = index;
        this.customMapping = customMapping;
        this.ignore = ignore;
        this.type = type;
        this.ready = false;
        this.previousConfig = Immutable.fromJS({});
        this.mainText = mainText;
        this.loaded = this.loadMetadata().then((result) => {
            this.ready = true;
            return result;
        });
    }

    loadMetadata() {
        return this.client.indices.getMapping({index: this.index, type: this.type}).then(result => {
            this.metadata = result[this.index].mappings[this.type].properties;
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
        field = field.replace(/\./g, ".properties.");
        console.log(field);
        if(this.customMapping && this.customMapping[field]) {
            return this.customMapping[field];
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

        return null;
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
        })
    }

    compile(query, goal, highlight) {
        let compiled = { "query": { "bool": { "must": [] } }};
        let highlightField = highlight ? highlight : this.mainText;
        compiled.highlight = { "fields" : { [highlightField] : {
            "fragment_size" : 150,
            "number_of_fragments" : 3,
            "no_match_size": 150
        }}};

        this.compileSelect(query, compiled, goal);
        if(goal == "summarize" || goal == "segment" ) {
            this.compileSegment(query, compiled, goal);
        }
        if(goal == "summary") {
            this.compileSummaryCell(query, compiled);
        }
        return compiled;
    }

    compileRule(rule) {
        switch (rule.get("op")) {
            case "in":
                return {"terms": {[rule.get("field")]: rule.get("values").toJSON()}};
            case "contains":
                return {"query_string" : { "default_field" : rule.get("field"),  "query" : rule.get("value")}};
            case "between":
                if(rule.get('type') == "date")
                    return { "range" : { [rule.get("field")] : { "gte" : rule.getIn(["values",0]), "lte" : rule.getIn(["values", 1]), "format": "yyyy-mm-dd"}}};
                else
                    return { "range" : { [rule.get("field")] : { "gte" : rule.getIn(["values",0]), "lte" : rule.getIn(["values", 1])}}};


            case "is":
                return { "term": { [rule.get("field")]: rule.get("value")}};
        }
        return {};
    }

    compileSelect(query, current, goal) {
        let rules = query.getIn(["select", "rules"]);
        if(rules) {
            current.size = goal == "select" ? 100 : 0,
            rules.map((rule) => {
                let compiledRule = this.compileRule(rule);
                _.get(current, "query.bool.must").push(compiledRule);
            });
        }

    }

    getDefaultSegmentOrder(type) {
        switch (type) {
            case "CATEGORICAL": return { "_count": "desc" };
            case  "TEXT": return { "_term": "asc" };
            case  "QUANTITATIVE": return {"_key": "asc"};
            case  "CONTINUOUS": return {"_key": "asc"};
            case  "DATE": return {"_key": "asc"};
            case  "BOOLEAN": return {};
        }
    }

    compileSegment(query, current) {
        //TODO: compileSegment: merge for dates
        let config = query.getIn(["segment"]);
        let field = config.get("field");
        if(!field) { return undefined;}
        let type = this.getType(field);
        let info = this.getFieldInfo(field);

        let result = {
            "terms": {
                "field": config.get("field"),
                "size": config.get("limit")
            }
        };
        switch (type) {
            case "CATEGORICAL":
                result = {
                    "terms": {
                        "field": config.get("field"),
                        "size": config.get("limit"),
                        "order": config.get("order").toJSON()
                    }
                };
                break;
            case  "TEXT":
                result = {
                        "terms": {
                        "field": config.get("field"),
                        "include": config.get("selectedKeys"),
                        "order": config.get("order").toJSON()
                    }
                };
                break;
            case  "QUANTITATIVE":
                result = {
                    "histogram" : {
                        "field" : config.get("field"),
                        "interval" :config.get("interval"),
                        "order": config.get("order").toJSON()
                    }
                };
                break;
            case  "CONTINUOUS":
                result = {
                    "histogram" : {
                        "field" : config.get("field"),
                        "interval" :config.get("interval"),
                        "order": config.get("order").toJSON()
                    }
                };
                break;
            case  "DATE":
                result = {
                    "date_histogram" : {
                        "field" : config.get("field"),
                        "interval" : config.get("interval"),
                        "format": config.get("dateFormat")
                    }
                };
                break;
            case  "BOOLEAN":
                result = {
                    "terms": {
                        "field": config.get("field")
                    }
                };
                break;
        }

        let merge = undefined;
        let filters = {};
        if(config.get("merge") && config.get("merge").size > 0) {
            switch (type) {
                case "CATEGORICAL":
                case  "TEXT":
                case  "BOOLEAN":
                    config.get("merge").forEach(f => {
                        filters[f.get("label")] = {
                            "terms" : { [field] : f.get("keys").toJSON()}
                        };
                    });
                    merge = {
                        "filters" : {
                            "filters" : filters
                        }
                    };
                    break;
                case  "QUANTITATIVE":
                case  "CONTINUOUS":
                    let interval = config.get("interval");
                    config.get("merge").forEach(f => {
                        let filter = {"or": []};
                        f.get("keys").forEach(k => {
                            let range = {
                                "range" : {
                                    [field] : {
                                        "gte" : k,
                                        "lt" : k+interval
                                    }
                                }
                            };
                            filter.or.push(range);
                        });
                        filters[f.get("label")] = filter;
                    });
                    merge = {
                        "filters" : {
                            "filters" : filters
                        }
                    };
                    break;
                case  "DATE":
                    result = {
                        "date_histogram" : {
                            "field" : config.get("field"),
                            "interval" : config.get("interval"),
                            "format": config.get("dateFormat")
                        }
                    };
                    break;

            }
        }

        current.aggs = {
            segments: result,
            merge: merge
        }
    }

    compileSummarize(query, current){
        if(query.summarize.summaries.length > 0) {
            current.aggs.segment.aggs = {};
            query.summarize.summaries.forEach((summary) => {
                let result = this.compileSummary(summary, current)
                current.aggs.segment.aggs[summary.field] = result;
            })
        }
    }

    getSummaryAgg(summary, current, segmentKey) {
        let field = summary.getIn(["field"]);

        switch (this.getType(field)) {
            case "CATEGORICAL": return {
                "terms": {
                    "field": field,
                    "size": 50
                }
            };
            case "TEXT":
                let exclude = summary.get("exclude") ? stopWords.concat(summary.get("exclude").toJSON()) : stopWords;
                if(segmentKey == "_all"){
                    return {
                        "significant_terms": {
                            "field": field,
                            "exclude": exclude,
                            "size": 50
                        }
                    };
                }

                return {
                    "significant_terms": {
                        "field": field,
                        "exclude": exclude,
                        "size": 50,
                        "gnd": {},
                        "background_filter": current.query
                    }
                };
            case "QUANTITATIVE":
                const max = this.getFieldInfo(field).stats.max;
                const min = this.getFieldInfo(field).stats.min;
                const delta = max - min;
                const interval = Math.ceil(delta/100);
                return {
                    "histogram": {
                        "field": field,
                        "interval": interval
                    }
                };
                
            case "CONTINUOUS":
                const maxC = this.getFieldInfo(field).stats.max;
                const minC = this.getFieldInfo(field).stats.min;
                const deltaC = maxC - minC;
                const intervalC = Math.ceil(deltaC/100);
                return {
                    "histogram": {
                        "field": field,
                        "interval": intervalC
                    }
                };
                
            case "DATE":
                let intervalDate = "month";
                return {
                    "date_histogram": {
                        "field": field,
                        "interval": intervalDate,
                        "format" : "MM-yyyy",
                        "order" : { "_key" : "desc" }
                    }
                };
                
            case "BOOLEAN":
                break;
        }
        return {};
    }

    getSegmentFilter(query, segment) {
        let label = query.getIn(["summary", "segment"]).get("label");
        let field = segment.getIn(["config", "field"]);
        let type = this.getType(field);
        let merge = segment.getIn(["config", "merge"]);

        if(merge) {
            merge = merge.find(m => m.get("label") == label);
        }

        let keys = merge ? merge.get("keys").toJSON(): [label]

        switch (type) {
            case "CATEGORICAL":
            case  "TEXT":
            case  "BOOLEAN":
                return {
                    "terms" : { [field] : keys}
                };
            case  "QUANTITATIVE":
            case  "CONTINUOUS":
                let filter = {"or": []};
                keys.forEach(k => {
                    let range = {
                        "range" : {
                            [field] : {
                                "gte" : k,
                                "lt" : k+ segment.getIn(["config", "interval"])
                            }
                        }
                    };
                    filter.or.push(range);
                });
                return filter;
            case  "DATE":
                return {};

        }
    }

    compileSummaryCell(query, compiled) {
        let field = query.getIn(["summary", "summary"]).get("field");
        let segmentKey =  query.getIn(["summary", "segment"]).get("label");
        let agg = this.getSummaryAgg(query.getIn(["summary", "summary"]), compiled, segmentKey);
        let filter = segmentKey == "_all" ? { match_all: {} } : this.getSegmentFilter(query, query.getIn(["summary", "segment"]));

        let result = {
            "aggs": {
                [segmentKey + "|" + field] : {
                    "filter" : filter,
                    "aggs" : { summary: agg }
                }
            }
        };
        compiled.aggs = result.aggs;
        return {};
    }

    execQuery(state, action, async) {
        try {
            state = this.execSelect(state, action, async);
            state = this.execSegment(state, action, async);
            state = this.execSummarize(state, action, async);
        } catch (ex) {
            console.error(ex);
        }
        this.previousConfig = state;
        return state;
    }

    execSummary(summary, state, action, async) {
        console.info("api.js",274, "Running Summary", summary.toJSON());
        let query = Immutable.Map({});
        query = query.set("select", state.getIn(["select", "config"]));
        query = query.set("summary", summary);
        let promise = this.run(query, "summary").then((result) => {
            let response = {};
            let keys = Object.keys(result.aggregations)[0].split("|");
            response.data = result.aggregations[keys.join("|")].summary.buckets;
            response.segment = keys[0];
            response.summary = keys[1];
            response.status = "LOADED";
            return response;
        });
        async(promise, newSummaryData);
        state = state.updateIn(["summarize", "data", "summaries"], summaries => {
            let field = summary.getIn(["summary", "field"]);
            let label = summary.getIn(["segment", "label"]);

            let current = summaries.findIndex(s => s.get("summary") == field && s.get("segment") == label);

            if(current == -1) {
                summaries = summaries.push(Immutable.fromJS({summary: field, segment: label, status: "LOADING", data: []}));
            } else {
                summaries = summaries.set(current, Immutable.fromJS({summary: field, segment: label, status: "LOADING", data: []}));
            }

            return summaries;
        });

        return state;
    }

    execSummarize(state, action, async) {
        try {
            console.info("api.js",274, "Running Summarize");
            let segmentsToUpdate = Immutable.fromJS([]);
            let segments = state.getIn(["summarize", "config", "segments"]);
            let prevSegments = this.previousConfig.getIn(["summarize", "config", "segments"]);
            let summaries = state.getIn(["summarize", "config", "summaries"]);
            let prevSummaries = this.previousConfig.getIn(["summarize", "config", "summaries"]);
            let summariesCells = Immutable.fromJS({});

            if (state.getIn(["segment", "config"]) != this.previousConfig.getIn(["segment", "config"]) ||
                state.getIn(["select", "config"]) != this.previousConfig.getIn(["select", "config"])) {
                segmentsToUpdate = segments;
                segmentsToUpdate.forEach(seg => {
                    summaries.forEach(sum => {
                        let key = seg.get("label") + "|" + sum.get('field');
                        seg = seg.setIn(["config"], state.getIn(["segment", "config"]));
                        summariesCells = summariesCells.set(key, Immutable.Map({
                            segment: seg,
                            summary: sum
                        }));
                    })
                });
            }
            else if (state.getIn(["summarize", "config"]) != this.previousConfig.getIn(["summarize", "config"])) {
                if (segments != prevSegments) {
                    segmentsToUpdate = segments;
                    if (prevSegments) {
                        segmentsToUpdate = segments.filter(s => !prevSegments.contains(s));
                    }
                    segmentsToUpdate.forEach(seg => {
                        summaries.forEach(sum => {
                            let key = seg.get("label") + "|" + sum.get('field');
                            seg = seg.setIn(["config"], state.getIn(["segment", "config"]));
                            summariesCells = summariesCells.set(key, Immutable.Map({
                                segment: seg,
                                summary: sum
                            }));
                        })
                    });
                } else if (summaries != prevSummaries) {

                    let summariesToUpdate = summaries;
                    if (prevSummaries) {
                        summariesToUpdate = summaries.filter(s => !prevSummaries.contains(s));
                    }
                    summariesToUpdate.forEach(sum => {
                        segments.forEach(seg => {
                            let key = seg.get("label") + "|" + sum.get('field');
                            seg = seg.setIn(["config"], state.getIn(["segment", "config"]));
                            summariesCells = summariesCells.set(key, Immutable.Map({
                                segment: seg,
                                summary: sum
                            }));
                        })
                    })
                }
            }
            for (let key of summariesCells.keys()) {
                let sum = summariesCells.get(key);
                state = this.execSummary(sum, state, action, async);
            }
        } catch (ex) {
            console.error(ex);
        }
        return state;
    }

    execSegment(state, action, async) {
        if( state.getIn(["segment", "config"]) != this.previousConfig.getIn(["segment", "config"]) ||
            state.getIn(["select", "config"]) != this.previousConfig.getIn(["select", "config"]))
        {
            console.info("api.js",274, "Running Segment");
            let query = Immutable.Map({});
            query = query.set("select", state.getIn(["select", "config"]));
            query = query.set("segment", state.getIn(["segment", "config"]));
            let promise = this.run(query, "segment").then(result => {
                if(!result.aggregations) {
                    return [];
                }

                let segments = result.aggregations.segments.buckets;
                if(result.aggregations.merge) {
                    let merges = result.aggregations.merge.buckets;
                    let mergeConf = state.getIn(["segment", "config", "merge"]);
                    if (merges) {
                        mergeConf.forEach(m => {
                            //Find the First
                            let idx = segments.findIndex(s => m.get("keys").contains(s.key));
                            let merged = merges[m.get("label")];
                            merged.key = m.get("label");
                            segments.splice(idx, 1, merged);
                            //Remove the rest;
                            idx = segments.findIndex(s => m.get("keys").contains(s.key));
                            while (idx > -1) {
                                segments.splice(idx, 1);
                                idx = segments.findIndex(s => m.get("keys").contains(s.key));
                            }
                        })
                    }
                }
                return segments;
            });
            async(promise, newSegmentData);
            state = state.setIn(["segment", "data", "status"], "LOADING");
        }
        return state;
    }

    execSelect(state, action, async) {
        if(state.getIn(["select", "config"]) != this.previousConfig.getIn(["select", "config"])) {
            console.info("api.js",274, "Running Select");
            let query = Immutable.Map({});
            query = query.set("select", state.getIn(["select", "config"]));
            let promise = this.run(query, "select").then((result) => {
                let response = {};
                response.stats = { total: result.hits.total };
                response.samples = result.hits.hits.filter(doc => doc.highlight).map((doc) => {
                    doc.highlight = doc.highlight[this.mainText];
                    return doc;
                });
                return response;
            });
            async(promise, newSelectData);
            state = state.setIn(["select", "data", "status"], "LOADING");
        }
        return state;
    }

    getDocuments(state, action, async, key, summaryField, segmentLabel) {
        let query = Immutable.Map({});
        let summaryRule = Immutable.fromJS({field: summaryField, op: "in", values: [key]});

        let segmentRule = segmentLabel == "_all" ? undefined : Immutable.fromJS({field: state.getIn(["segment", "config", "field"]), op: "in", values: [segmentLabel]});

        query = query.set("select", state.getIn(["select", "config"]));

        query = query.updateIn(["select","rules"], rules => rules ? rules.push(summaryRule) : Immutable.fomrJS([summaryRule]));
        if(segmentRule) {
            query = query.updateIn(["select","rules"], rules => rules ? rules.push(segmentRule) : Immutable.fomrJS([segmentRule]));
        }

        let esQuery = this.compile(query, "select", summaryField);
        let promise = this.call(esQuery).then(result => {
            result = result.hits.hits.map(h => {
                let doc = h._source;
                doc.highlight = h.highlight[summaryField];
                return doc;
            });
            return result;
        });
        async(promise, newDocumentsData);
        return state;
    }

    run(query, goal) {
        let esQuery = this.compile(query, goal);
        return this.call(esQuery);
    }

    execute(query) {
        let esQuery = this.compile(query);
        let SelectPromisse = this.call(esQuery);
        return [
            {key: "select.sample", promisse: SelectPromisse.then((result) => result.hits.hits.map((doc) => {
                    let document =  doc._source;
                    document.highlight = doc.highlight[this.mainText];
                    return document;
                }))},
            {key: "segment.data", promisse: SelectPromisse.then((result) => _.sortBy(result.aggregations.segment.buckets, 'key'))},
            {key: "summarize.data", promisse: SelectPromisse.then((result) => {
                    let summaries = [];
                    if(result.aggregations.segment && result.aggregations.segment.buckets) {
                        for (let segment of result.aggregations.segment.buckets) {
                            for (let key in segment) {
                                if (key === "key" || key === "doc_count") {
                                    continue;
                                }
                                let summary = {
                                    segment: segment.key,
                                    field: key,
                                    data: segment[key].buckets
                                };
                                summaries.push(summary);
                            }
                        }
                    }
                    else if(!result.aggregations.segment.buckets && result.aggregations.segment) {
                        for(let key in result.aggregations.segment) {
                            if(key === "key" || key === "doc_count") {
                                continue;
                            }
                            let summary = {
                                segment: "ALL DATA",
                                field: key,
                                data: result.aggregations.segment[key].buckets
                            };
                            summaries.push(summary);
                        }
                    }
                    return summaries;
                })
            },
            {key: "select.stats.total", promisse: SelectPromisse.then((result) => result.hits.total)}
        ]
    }
}



































