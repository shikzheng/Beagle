import Immutable from  'immutable';
import moment from 'moment';
import {stopWords} from '../config/stopWords';

function cammel(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

export default class Compiler {
    constructor(api) {
        this.api = api;
    }

    getDateFormat(interval) {
        switch (interval) {
            case "year":
                return "yyyy";
            case "month":
            case "quarter":
                return "MM/yyyy";
            case "week":
            case "day":
                return "dd/MM/yyyy";
            case "hour":
                return "dd/MM - hh:mm a";
            case "minute":
                return "hh:mm a";
            case "second":
                return "hh:mm:ss a";
        }
    }

    getEsInterval(interval) {
        switch (interval) {
            case "year":
                return "1y";
            case "month":
                return "1M";
            case "quarter":
                return "4M";
            case "week":
                return "7d";
            case "day":
                return "1d";
            case "hour":
                return "1h";
            case "minute":
                return "1m";
            case "second":
                return "1s";
        }
    }


    getDefinedSections(query) {
        let result = {};
        if(query.getIn(["select", "rules"]).size > 0) {
            result.select = true;
        }
        if(query.getIn(["segment", "field"])) {
            result.segment = true;
        }
        return result;
    }

    getFilterSelect(query) {
        let rules = query.getIn(["select", "rules"]);
        if(rules) {
            let result = { bool: {must: []}};
            for (let rule of rules) {
                result.bool.must.push(this.getFilterRule(rule));
            }
            return result;
        }
        return undefined;
    }

    getFilterRule(rule) {
        try {
            switch (rule.get("op")) {
                case "in":
                    let keys = rule.get("value").toJSON();
                    keys = keys.concat(keys.map(k => cammel(k)))
                    keys = keys.concat(keys.map(k => k.toLowerCase()))
                    keys = keys.concat(keys.map(k => k.toUpperCase()))
                    keys = keys.concat(keys.map(k => cammel(k.toLowerCase())))
                    
                    return {"terms": {[rule.get("field")]: keys}};
                case "contains":
                    return {"query_string": {"default_field": rule.get("field"), "query": rule.get("value")}};
                case "between":
                    if (this.api.getType(rule.get("field"))  == "DATE")
                        return {
                            "range": {
                                [rule.get("field")]: {
                                    "gte": rule.getIn(["value", 0]),
                                    "lte": rule.getIn(["value", 1]),
                                    "format": "yyyy-mm-dd"
                                }
                            }
                        };
                    else
                        return {
                            "range": {
                                [rule.get("field")]: {
                                    "gte": rule.getIn(["value", 0]),
                                    "lte": rule.getIn(["value", 1])
                                }
                            }
                        };


                case "is":
                    return {"term": {[rule.get("field")]: rule.get("value")}};
            }
            return {};
        } catch (ex) {
            console.trace(ex);
        }
    }

    getAggsField(field, options) {
        try {
            let {limit, order, include, exclude, interval, min_doc_count, significant, background_filter} = options;
            exclude = exclude || [];

            let type = this.api.getType(field);
            switch (type) {
                case "GEO_COUNTRY_NAMES":
                case "CATEGORICAL":
                    return {
                        "terms": {
                            "field": field,
                            "size": limit || 1000,
                            "order": order,
                            "include": include,
                            "min_doc_count": min_doc_count || 1
                        }
                    };
                    
                case "GEO_US_ZIP":
                    return {
                        "terms": {
                            "field": field,
                            "size": 100000,
                            "order": order,
                            "include": include,
                            "min_doc_count": min_doc_count || 1
                        }
                    };
                    
                case  "TEXT":
                    //significant = false;
                    if(significant) {
                        return {
                            "significant_terms": {
                                "field": field,
                                "mutual_information": {},
                               // "script_heuristic": {
                                //    "script": "_subset_freq/_subset_size * Math.log(_superset_size/_superset_freq)"
                                //},
                               //  "script_heuristic": {
                               //     "script": "_subset_freq"
                               // },
                                "include": include,
                                "exclude": exclude.concat(stopWords),
                                "size": limit || 50,
                                //"min_doc_count": min_doc_count || 1,
                                "background_filter": background_filter
                            }
                        };
                    }
                    return {
                        "terms": {
                            "field": field,
                            "include": include,
                            "exclude": exclude.concat(stopWords),
                            "size": limit || 50,
                            "order": order,
                            "min_doc_count": min_doc_count || 1
                        }
                    };
                    
                case  "QUANTITATIVE":
                    return {
                        "histogram": {
                            "field": field,
                            "interval": interval || 1,
                            "order": order
                        }
                    };
                    
                case  "CONTINUOUS":
                    return {
                        "histogram": {
                            "field": field,
                            "interval": interval || 1,
                            "order": order
                        }
                    };
                    
                case  "DATE":
                    return {
                        "date_histogram": {
                            "field": field,
                            "interval": interval || "month",
                            "format": this.getDateFormat(interval || "month")
                        }
                    };
                    
                case  "BOOLEAN":
                    return {
                        "terms": {
                            "field": field
                        }
                    };
                    
            }
        } catch(ex) {
            console.error(ex);
        }
    }

    getSegmentAggs(query, options) {
        let config = query.getIn(["segment"]);
        let field = config.get("field");
        if(!field) { return undefined;}

        let limit = config.get("limit") || 400;
        let order = config.get("order") ? config.get("order").toJSON() : undefined;
        let include = config.get("selectedKeys");
        let interval = config.get("interval");
        let exclude = [];

        return this.getAggsField(field, {limit, order, include, exclude, interval})
    }

    getSegmentMerger(query, options) {
        try {
            let merge = undefined;
            let filters = {};

            let config = query.getIn(["segment"]);
            let field = config.get("field");
            if(!field) { return undefined;}
            let type = this.api.getType(field);
            let info = this.api.getFieldInfo(field);
            let limit = config.get("limit") || 50;
            let order = config.get("order") ? config.get("order").toJSON() : undefined;

            if (config.get("merge") && config.get("merge").size > 0) {
                switch (type) {
                    case "GEO_COUNTRY_NAMES":
                    case "CATEGORICAL":
                    case  "TEXT":
                    case  "BOOLEAN":
                        config.get("merge").forEach(f => {
                            let keys = f.get("keys").toJSON();
                            keys = keys.concat(keys.map())
                            filters[f.get("label")] = {
                                "terms": {[field]: f.get("keys").toJSON()}
                            };
                        });
                        merge = {
                            "filters": {
                                "filters": filters
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
                                    "range": {
                                        [field]: {
                                            "gte": k,
                                            "lt": k + interval
                                        }
                                    }
                                };
                                filter.or.push(range);
                            });
                            filters[f.get("label")] = filter;
                        });
                        merge = {
                            "filters": {
                                "filters": filters
                            }
                        };
                        break;
                    case  "DATE":
                        result = {
                            "date_histogram": {
                                "field": config.get("field"),
                                "interval": config.get("interval"),
                                "format": config.get("dateFormat")
                            }
                        };
                        break;

                }
            }
            return merge;
        } catch (ex) {
            console.error("Couldn't merge", query.toJSON(), options);
            console.error(ex);
        }
    }

    getSegmentSelect(query, options) {
        let field = query.getIn(["segment", "field"]);
        if(!options.segment || options.segment.label == "_all") {
            return undefined;
        }
        let interval = query.getIn(["segment", "interval"]) || 1;
        let type = this.api.getType(field);

        let label = options.segment.label;

        let merge = query.getIn(["segment", "merge"]);

        if(merge) {
            merge = merge.find(m => m.get("label") == label);
        }

        let keys = merge ? merge.get("keys").toJSON(): [label]
        let filter = {"or": []};
        switch (type) {
            case "GEO_COUNTRY_NAMES":
            case "CATEGORICAL":
            case  "TEXT":
            case  "BOOLEAN":
                return {
                    "terms" : { [field] : keys}
                };
            case  "QUANTITATIVE":
            case  "CONTINUOUS":
                keys.forEach(k => {
                    let range = {
                        "range" : {
                            [field] : {
                                "gte" : k,
                                "lt" : k + interval
                            }
                        }
                    };
                    filter.or.push(range);
                });
                return filter;
            case  "DATE":
                let dateFormat = this.getDateFormat(interval || "month")
                let dateInterval =
                keys.forEach(k => {

                    let range = {
                        "range" : {
                            [field] : {
                                "gte" : k,
                                "lt" : k + "||+"+ this.getEsInterval(interval),
                                "format": dateFormat
                            }
                        }
                    };
                    filter.or.push(range);
                });

                return filter;
        }
    }

    getSummaryAggs(query, options) {
        let {summary, segment} = options;
        let field = summary.field;
        if(!field) { return undefined;}

        let limit = summary.limit;
        let order = summary.order || undefined;
        let include = summary.include;
        let exclude = summary.exclude;
        let interval = summary.interval;
        let significant = true;

        let defined = this.getDefinedSections(query);



        let background_filter = undefined;

        console.log("Compiler.js",358, options.segment, options.segment.label == "_all", defined.select);
        if((!options.segment || options.segment.label == "_all")  && !defined.select){
            console.log("Compiler.js",359);
            significant = false;
        }

        if((options.segment && options.segment.label != "_all") && defined.select){
            console.log("Compiler.js",363);
            background_filter = this.getFilterSelect(query, options);
            console.log("Compiler.js",369, background_filter);
        }

        return this.getAggsField(field, {limit, order, include, exclude, interval, significant, background_filter})


    }

    compileSegment(query, options) {
        let result = {};
        if(!this.getDefinedSections(query).segment) {
            return undefined;
        }

        result.query = this.getFilterSelect(query);
        result.size = 0;

        if(!query.getIn(["segment", "field"])) return result;

        let aggs = {};
        result.aggs = {global: {global: {}, aggs}};

        aggs.segment = this.getSegmentAggs(query, options);

        aggs.segment.aggs = {selected: {filter: this.getFilterSelect(query)}};

        aggs.merged = this.getSegmentMerger(query, options);
        if(aggs.merged) {
            aggs.merged.aggs = {selected: {filter: this.getFilterSelect(query)}};
        }

        return result;
    }

    compileSelect(query, options) {
        let result = {};
        result.query = this.getFilterSelect(query);
        return result;
    }

    compileSummary(query, options) {

        let result = {};
        result.size = 0;
        result.query = this.getFilterSelect(query);

        let aggs = {};

        aggs.summary = this.getSummaryAggs(query, options);

        let defined = this.getDefinedSections(query);
        let type = this.api.getType(options.summary.field);
        let segmentSelect = this.getSegmentSelect(query, options);
        console.log("Compiler.js",408, options, defined);
        if((!options.segment || options.segment.label == "_all") && defined.select)
        {
            if(type != "TEXT" && type != "CATEGORICAL" && type != "GEO_COUNTRY_NAMES") {
                aggs.summary.aggs = {segment: {filter: this.getFilterSelect(query)}};
                result.aggs = {global: {global: {}, aggs}};
            } else {
                console.log("Compiler.js",417)
                result.aggs = aggs;
                if(type != "TEXT") {
                        result.next = {
                            map: this.summaryNextAllMap(query, options).bind(this),
                            merge: this.summaryMerge().bind(this)
                    }
                }
            }

        } else if(options.segment && defined.select ) {
            if(type != "TEXT" && type != "CATEGORICAL" && type != "GEO_COUNTRY_NAMES") {
                aggs.summary.aggs = segmentSelect ? {segment: {filter: this.getSegmentSelect(query, options)}} : {};
                result.aggs = aggs;
            } else {
                result.aggs = aggs;

                let segmentSelect = this.getSegmentSelect(query, options);
                if(segmentSelect) {
                    result.query.bool.must.push(this.getSegmentSelect(query, options));
                }
                if(type != "TEXT") {
                    result.next = {
                        map: this.summaryNextSegmentMap(query, options).bind(this),
                        merge: this.summaryMerge().bind(this)
                    };
                }
            }
            result.aggs = aggs;
        } else if(options.segment && !defined.select ) {
            if(type != "TEXT" && type != "CATEGORICAL" && type != "GEO_COUNTRY_NAMES") {
                aggs.summary.aggs = segmentSelect ? {segment: {filter: this.getSegmentSelect(query, options)}} : {};
                result.aggs = aggs;
            } else {
                result.aggs = aggs;

                let segmentSelect2 = this.getSegmentSelect(query, options);
                if(segmentSelect2) {
                    result.query.bool.must.push(segmentSelect2);
                }

                if(type != "TEXT") {
                    result.next = {
                        map: this.summaryNextSegmentMap(query, options).bind(this),
                        merge: this.summaryMerge().bind(this)
                    };
                }
            }
            result.aggs = aggs;
        }
        else {
            result.aggs = aggs;
        }

        return result;
    }

    summaryNextSegmentMap(query,options) {
        return (original) => {

            let nexOptions = Object.assign({},options);
            nexOptions.summary = Object.assign({},
                nexOptions.summary,
                {
                    include: original.summary.map(s => s.key)
                }
            );

            nexOptions.segment = { label: "_all" };

            let nextS3Query = query;
            console.group("compile Error", nextS3Query.toJSON(), nexOptions);
            let nextQuery = this.compile(nextS3Query, nexOptions);
            console.groupEnd();
            nextQuery.next = undefined;

            return {nextQuery, nextS3Query, nexOptions};
        }
    }

    summaryNextAllMap(query,options) {
        return (original) => {
            let nexOptions = Object.assign({},options);
            nexOptions.summary = Object.assign({}, nexOptions.summary,{include: original.summary.map(s => s.key)});
            let nextS3Query = query
                .setIn(["select"], Immutable.fromJS({ rules: []}));
            let nextQuery = this.compile(nextS3Query, nexOptions);

            return {nextQuery, nextS3Query, nexOptions};
        }
    }

    compileDocuments(query, options) {
        let result = {};
        let {segmentLabel, summaryField, summaryKey} = options
        console.log("Compiler.js",522, options);
        let highlightField = options.highlight ? options.highlight : this.api.mainText;
        result.highlight = { "fields" : { [highlightField] : {
            "fragment_size" : 150,
            "number_of_fragments" : 3,
            "no_match_size": 150
        }}};
        result.query = this.getFilterSelect(query);
        let rule = {field: summaryField, op: "in", value: [summaryKey]};
        result.query.bool.must.push(this.getFilterRule(Immutable.fromJS(rule)));
        result.size = 100
        if(segmentLabel != "_all") {
            result.query.bool.must.push(this.getSegmentSelect(query, { segment: { label: segmentLabel }}));
        }


        return result;
    }

    summaryMerge() {
        return (original, next) => {
            let merged = {};
            original.summary = original.summary.map(o => {
                let n = next.summary.find(nc => nc.key == o.key);
                o.overall = n.count;
                o.segment = o.count;
                o.proportion = o.count / n.count;
                return o;

            });

            return original;
        }
    }

    compile(query, options) {
        try {
            switch (options.target) {
                case "segment":
                    return this.compileSegment(query, options);
                case "select":
                    return this.compileSelect(query, options);
                case "summary":
                    return this.compileSummary(query, options);
                case "documents":
                    return this.compileDocuments(query, options);
            }
        } catch (ex) {
            console.error("Compiler.js",244, "Failed to Compile", ex);
        }
    }
}



















