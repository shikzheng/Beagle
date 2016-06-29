/**
 * Created by cristianfelix on 1/15/16.
 */
import {combineReducers}  from 'redux'
import Immutable from  'immutable'
import states from './config/states';
import API from './Data/api'

//loadSelectInfo --------------------------------------------------------------------
export function loadSelectInfo(field) { return { type: "LOAD_SELECT_INFO", field }}
export function loadSelectInfoReducer(state = {}, action, async, prevState) {
    if(action.type == "LOAD_SELECT_INFO") {
        let api = state.getIn(["app", "api"]);
        let query = Immutable.fromJS({
            "select":{
                "rules":[]
            },
            "segment":{
                "field":action.field.key,
                "merge":[],
                "exclude":[],
                "interval":1,
                "dateFormat":"yyyy",
                "limit":300
            },
            "summarize":{}
        })
        let promise = api.execute(query, {target: "segment"});
        async(promise, newFilterData);
    }
    return state;
}

//newFilterData --------------------------------------------------------------------
export function newFilterData(result, error) { return { type: "NEW_FILTER_DATA", result, error }}
export function newFilterDataReducer(state = {}, action, async, prevState) {
    if(action.type == "NEW_FILTER_DATA") {
        state = state.setIn(["select", "config", "options"], Immutable.fromJS(action.result.segment));
    }
    return state;
}

//clearAll --------------------------------------------------------------------
export function clearAll() { return { type: "CLEAR_ALL" }}
export function clearAllReducer(state = {}, action, async, prevState) {
    if(action.type == "CLEAR_ALL") {
        console.log("CLEAR_ALL");
        state = state
            .setIn(["select", "config", "rules"], Immutable.List())
            .setIn(["segment", "config"], Immutable.fromJS({limit:50,sort:"VALUE"}))
            .setIn(["segment", "data", "segments"], Immutable.List())
            .setIn(["summarize", "config"], Immutable.fromJS({segments:[], summaries: []}))
            .setIn(["summarize", "data"], Immutable.fromJS({summaries:[], status: "INITIAL"}))
    }
    return state;
}


//clearDocuments --------------------------------------------------------------------
export function clearDocuments() { return { type: "CLEAR_DOCUMENTS" }}
export function clearDocumentsReducer(state = {}, action, async, prevState) {
    if(action.type == "CLEAR_DOCUMENTS") {
        state = state.setIn(["documents", "data"], Immutable.fromJS([]));
    }
    return state;
}

//removeKeyfromSummary --------------------------------------------------------------------
export function removeKeyfromSummary(key, field) { return { type: "REMOVE_KEY_SUMMARY", key, field }}
export function removeKeyfromSummaryReducer(state = {}, action, async, prevState) {
    if(action.type == "REMOVE_KEY_SUMMARY") {
        let oldState = state;
        state = state.updateIn(["summarize", "config", "summaries" ], summaries => {
            let summaryIdx = summaries.findIndex(s => s.get("field") == action.field);
            return summaries.update(summaryIdx, summary => summary.update("exclude", ex => ex ? ex.push(action.key) : Immutable.fromJS([key])));
        });
        if(oldState != state) {
            state = loadQueryReducer(state, { type: "LOAD_QUERY" }, async, prevState);
        }
    }
    return state;
}

//splitSegment --------------------------------------------------------------------
export function splitSegment(item) { return { type: "SPLIT_SEGMENT", item }}
export function splitSegmentReducer(state = {}, action, async, prevState) {
    if(action.type == "SPLIT_SEGMENT") {
        let oldState = state;
        state = state.updateIn(["segment", "config", "merge" ], merges => {
            let current = merges.findIndex(m => m.get("label") == action.item.get("key"));
            if(current > -1) {
                return merges.delete(current);
            }
            return merges;
        });
        if(oldState != state) {
            state = loadQueryReducer(state, { type: "LOAD_QUERY" }, async, prevState);
        }
    }
    return state;
}

//mergeSegments --------------------------------------------------------------------
export function mergeSegments(s1,s2) { return { type: "MERGE_SEGMENTS", s1, s2 }}
export function mergeSegmentsReducer(state = {}, action, async, prevState) {
    if(action.type == "MERGE_SEGMENTS") {
        let {s1,s2} = action;
        if(s1.key == s2.key) {
            return state;
        }
        let oldState = state;
        state = state.updateIn(["segment", "config", "merge" ], merges => {
            if(!merges) { merges = Immutable.List(); }
            let currentTarget = merges.findIndex(m => m.get("label") == s2.key);
            let currentSource = merges.findIndex(m => m.get("label") == s1.key);
            let label = "";

            if(currentTarget >= 0 && currentSource >= 0) {
                let sourceKeys = merges.get(currentSource).get("keys");
                merges = merges.delete(currentSource);
                merges = merges.set(currentTarget, merges.get(currentTarget).updateIn(["keys"], c => c.concat(sourceKeys)));
                return merges;
            }

            //Target is a merge
            if(currentTarget >= 0) {
                merges = merges.set(currentTarget, merges.get(currentTarget).updateIn(["keys"], c => c.push(s1.key)));
                return merges;
            }

            //Source is a merge
            if(currentSource >= 0) {
                label = prompt("Label");
                if(!label || label.length == 0) {
                    return merges;
                }
                let sourceKeys = merges.get(currentSource).get("keys");
                merges = merges.delete(currentSource);
                sourceKeys = sourceKeys.push(s2.key);
                merges = merges.push(Immutable.fromJS({label, keys:sourceKeys }));
                return merges;
            }

            //No One is a merger

            label = prompt("Label");
            if(!label || label.length == 0) {
                return merges;
            }
            merges = merges.push(Immutable.fromJS({label, keys:[s1.key, s2.key] }));
            return merges;
        });
        if(oldState != state) {
            state = loadQueryReducer(state, { type: "LOAD_QUERY" }, async, prevState);
        }
    }
    return state;
}

//loadDocuments --------------------------------------------------------------------
export function loadDocuments(key, summaryField, segmentLabel) { return { type: "LOAD_DOCUMENTS", key, summaryField, segmentLabel  }}
export function loadDocumentsReducer(state = {}, action, async, prevState) {
    /*if(action.type == "LOAD_DOCUMENTS") {
        let {key, summaryField, segmentLabel} = action;
        let api = state.getIn(["app", "api"]);
        state = api.getDocuments(state, action, async, key, summaryField, segmentLabel);*/

    if(action.type == "LOAD_DOCUMENTS") {
        console.debug("LOAD_DOCUMENTS");
        let query = Immutable.fromJS({
            select: state.getIn(["select", "config"]),
            segment: state.getIn(["segment", "config"]),
            summarize: state.getIn(["summarize", "config"])
        });
        let api = state.getIn(["app", "api"]);
        console.log({target: "documents", summaryKey: action.key, summaryField: action.summaryField, segmentLabel: action.segmentLabel });
        let promise = api.execute(query, {target: "documents", summaryKey: action.key.toString(), summaryField: action.summaryField, segmentLabel: action.segmentLabel });
        async(promise, newDocumentsData);
        //state = state.setIn(["select", "data", "status"], "LOADING");
    }
    return state;

    /*}
    return state;*/
}

//removeSelectedSegment --------------------------------------------------------------------
export function removeSelectedSegment(label) { return { type: "REMOVE_SELECTED_SEGMENT", label }}
export function removeSelectedSegmentReducer(state = {}, action, async, prevState) {
    if(action.type == "REMOVE_SELECTED_SEGMENT") {
        let {label} = action;
        state = state.updateIn(["summarize", "config", "segments" ], segments => {
            let current = segments.findIndex(c => c.get("label") == label);
            if(current > -1) {
                return segments.delete(current);
            }
        });
        state = loadQueryReducer(state, { type: "LOAD_QUERY" }, async, prevState);
    }
    return state;
}


//removeSummary --------------------------------------------------------------------
export function removeSummary(field) { return { type: "REMOVE_SUMMARY", field }}
export function removeSummaryReducer(state = {}, action, async, prevState) {
    if(action.type == "REMOVE_SUMMARY") {
        let {field} = action;
        state = state.updateIn(["summarize", "config", "summaries" ], summaries => {
            let current = summaries.findIndex(c => c.get("field") == field);
            if(current > -1) {
                return summaries.delete(current);
            }
        });
        state = loadQueryReducer(state, { type: "LOAD_QUERY" }, async, prevState);
    }
    return state;
}

//selectSegment --------------------------------------------------------------------
export function selectSegment(segment) { return { type: "SELECT_SEGMENT", segment }}
export function selectSegmentReducer(state, action, async, prevState) {
    //TODO: selectSegmentReducer: Remove _all summary on segment select
    if(action.type == "SELECT_SEGMENT") {
        let {segment} = action;
        state = state.updateIn(["summarize", "config", "segments" ], segments => {
            let current = segments.findIndex(c => c.get("label") == segment.key);
            if(current == -1) {
                let segmentInfo = state.getIn(["segments", "config"]);
                segments = segments.push(Immutable.fromJS({label: segment.key}));
            }
            let _all = segments.findIndex(c => c.get("label") == "_all");
            if(_all > -1) {
                segments = segments.remove(_all);
            }
            return segments;
        });
        state = loadQueryReducer(state, { type: "LOAD_QUERY" }, async,prevState);
    }
    return state;
}

//addSummary --------------------------------------------------------------------
export function addSummary() { return { type: "ADD_SUMMARY" }}
export function addSummaryReducer(state = {}, action, async, prevState) {
    if(action.type == "SAVE_SUMMARY") {
        let {summary} = action;
        state = state.updateIn(["summarize", "config", "summaries" ], summaries => {
            let current = summaries.findIndex(c => c.get("field") == summary.field);
            if(current > -1) {
                return summaries.set(current, Immutable.fromJS(summary));
            }
            return summaries.push(Immutable.fromJS(summary));
        });
        if(state.getIn(['summarize', 'config', 'segments']).size == 0) {
            state = state.updateIn(["summarize", "config", "segments" ], summaries => summaries.push(Immutable.fromJS({
                label: "_all",
                keys: ".*"
            })));
        }

        state = loadQueryReducer(state, { type: "LOAD_QUERY" }, async, prevState);
    }
    return state;
}
/*
keys
:
".*"
label
:
"_all"*/
//setSegment --------------------------------------------------------------------
export function setSegment() { return { type: "SET_SEGMENT" }}
export function setSegmentReducer(state = {}, action, async, prevState) {
    if(action.type == "SET_SEGMENT") {
        state = state.setIn(["segment", "config"], Immutable.fromJS(action.segment));
        state = state.setIn(["summarize", "config", "segments"], Immutable.fromJS([{keys: ".*", label: "_all"}]));
        state = loadQueryReducer(state, { type: "LOAD_QUERY" }, async, prevState);
    }
    return state;
}


//setEmails -------------------------------------------------------------------------
// export function setSegment() { return { type: "SET_EMAILS" }}
// export function setSegmentReducer(state = {}, action, async, prevState) {
//     if(action.type == "SET_EMAILS") {
//         state = state.setIn(["segment", "config"], Immutable.fromJS(action.email));
//         state = state.setIn(["summarize", "config", "segments"], Immutable.fromJS([{keys: ".*", label: "_all"}]));
//         state = loadQueryReducer(state, { type: "LOAD_QUERY" }, async, prevState);
//     }
//     return state;
// }
//removeSegment --------------------------------------------------------------------
export function removeSegment() { return { type: "SET_SEGMENT" }}
export function removeSegmentReducer(state = {}, action, async, prevState) {
    if(action.type == "REMOVE_SEGMENT") {
        state = state.setIn(["segment", "config"], undefined);
        state = loadQueryReducer(state, { type: "LOAD_QUERY" }, async, prevState);
    }
    return state;
}

//removeRule --------------------------------------------------------------------
export function removeRule() { return { type: "REMOVE_RULE" }}
export function removeRuleReducer(state = {}, action, async, prevState) {
    if(action.type == "REMOVE_RULE") {
        let {field} = action;
        state = state.updateIn(["select", "config", "rules" ], rules => {
            let current = rules.findIndex(c => c.get("field") == field);
            if(current > -1) {
                return rules.delete(current);
            }
        });
        state = loadQueryReducer(state, { type: "LOAD_QUERY" }, async, prevState);
    }
    return state;
}

//saveRule --------------------------------------------------------------------
export function saveRule() { return { type: "SAVE_RULE" }}
export function saveRuleReducer(state = {}, action, async, prevState) {
    if(action.type == "SAVE_RULE") {
        let {rule} = action;
        state = state.updateIn(["select", "config", "rules" ], rules => {
            let current = rules.findIndex(c => c.get("field") == rule.field);
            if(current > -1) {
                return rules.set(current, Immutable.fromJS(rule));
            }
            return rules.push(Immutable.fromJS(rule));
        });
        state = loadQueryReducer(state, { type: "LOAD_QUERY" }, async, prevState);
    }
    return state;
}


//newDocumentsData --------------------------------------------------------------------
export function newDocumentsData(result, error) { return { type: "NEW_DOCUMENTS_DATA", result, error }}
export function newDocumentsDataReducer(state = {}, action, async, prevState) {
    if(action.type == "NEW_DOCUMENTS_DATA") {
        state = state.setIn(["documents", "data"], Immutable.fromJS(action.result));
    }
    return state;
}

//newSummaryData --------------------------------------------------------------------
export function newSummaryData(result, error) { return { type: "NEW_SUMMARY_DATA", result, error  }}
export function newSummaryDataReducer(state = {}, action, async, prevState) {
    if(action.type == "NEW_SUMMARY_DATA") {
        console.info("NEW_SUMMARY_DATA", action.result);
        let summaryOP = action.result.options.summary;
        let segmentOP = action.result.options.segment;
        let segmentLabel = segmentOP ? segmentOP.label : "all";

        let current = state.getIn(["summarize", "data", "summaries"])
            .findIndex(c => c.get('segment') == segmentLabel &&
                            c.get('summary') == summaryOP.field);


        let newSummary = Immutable.fromJS({
            segment: segmentLabel,
            summary: summaryOP.field,
            data: action.result.summary
        });


        if(current > -1) {
            state = state.setIn(["summarize", "data", "summaries", current], Immutable.fromJS(newSummary));
        } else {
            state = state.updateIn(["summarize", "data", "summaries"],
                (summaries) => summaries.push(newSummary))
        }
    }
    return state;
}

//newSelectData --------------------------------------------------------------------
export function newSelectData(result, error) { return { type: "NEW_SELECT_DATA", result, error }}
export function newSelectDataReducer(state = {}, action, async, prevState) {
    if(action.type == "NEW_SELECT_DATA") {
        console.debug("NEW_SELECT_DATA")
        let {result, error} = action;
        if(error) {
            throw error;
        }

        state = state
            .setIn(["select", "data", "samples"], Immutable.fromJS(result.documents))
            .setIn(["select", "data", "status"], "LOADED")
            .setIn(["select", "data", "stats"], Immutable.fromJS(result.count));
    }
    return state;
}

//newSegmentData --------------------------------------------------------------------
export function newSegmentData(result, error) { return { type: "NEW_SEGMENT_DATA", result, error }}
export function newSegmentDataReducer(state = {}, action, async, prevState) {
    if(action.type == "NEW_SEGMENT_DATA") {
        console.debug("NEW_SEGMENT_DATA");
        let {result, error} = action;
        if(error) {
            throw error;
        }
        state = state.setIn(["segment", "data", "status"], "LOADED");

        if(result) {
            state = state.setIn(["segment", "data", "segments"], Immutable.fromJS(result.segment));
        } else {
            state = state.setIn(["segment", "data", "segments"], Immutable.fromJS({}));
        }
    }
    return state;
}

//Login ---------------------------------------------------------
export function login(dataset) { return { type: "LOGIN", dataset: dataset }}
export function loginReducer(state, action, async, prevState) {
    if(action.type == "LOGIN") {
        console.debug("LOGIN")
        let count = state.getIn(["server", 'data', "tries"]) || 0;
        if(count > 3){
            return state.setIn(["server", "data", "failed"], true);
        }
        let dataset = action.dataset || "default";
        let candidate = states[dataset];
        let password = undefined;

        if(candidate.getIn(['server', 'config', 'requirePassword'])) {
            password = sessionStorage.getItem(dataset);
            while(!password) {
                password = prompt("Password");
            }
            candidate = candidate
                .setIn(['server', 'config', 'password'], password)
                .setIn(['server', 'config', 'dataset'], dataset)
                .setIn(["server", 'data', "status"], 'disconnected')
                .setIn(["server", 'data', "tries"], count);
        }
        state = candidate;

        state = connectReducer(state, { type: "CONNECT" }, async);
    }
    return state;
}

//Connect ---------------------------------------------------------
export function connect() { return { type: "CONNECT" }}
export function connectReducer(state = {}, action, async, prevState) {
    if(action.type == "CONNECT") {
        console.debug("CONNECT");
        let {host, index, type, mainText, ignore, password , customMapping} = state.getIn(['server', 'config']).toJSON();
        let api = new API(host, index, type, mainText, ignore, password, customMapping);
        async(api.loaded, apiReady);
        state = state
            .setIn(["server", 'data', "status"], 'connecting')
            .setIn(["app", "api"], api);
    }
    return state;
}

//apiReady --------------------------------------------------------------------
export function apiReady(result, error) { return { type: "API_READY", error }}
export function apiReadyReducer(state, action, async, prevState) {
    if(action.type == "API_READY") {
        console.debug("API_READY");
        if(action.error) {
            console.error("reducers.js",359, action.error);
            //async(Promise.resolve(), () => login(state.getIn(['server', 'config', 'dataset'])));
        } else {
            let password = state.getIn(['server', 'config', 'password']);
            let dataset = state.getIn(['server', 'config', 'dataset']);
            sessionStorage.setItem(dataset, password);
            state = state.setIn(["server", 'data', "status"], 'connected');
            state = loadQueryReducer(state, { type: "LOAD_QUERY" }, async, prevState);
        }
        state.updateIn(["server", 'data', "tries"], (count) => count ? count + 1 : 1 );
    }
    return state;
}

//selectLoader --------------------------------------------------------------------
export function selectLoader(query) { return { type: "SELECT_LOADER" }}
export function selectLoaderReducer(state = {}, action, async, prevState) {
    if(action.type == "SELECT_LOADER") {
        console.debug("LOAD_SELECT");
        let query = Immutable.fromJS({
            select: state.getIn(["select", "config"]),
            segment: {},
            summarize: {}
        });
        let api = state.getIn(["app", "api"]);
        let promise = api.execute(query, {target: "select"});
        async(promise, newSelectData);
        state = state.setIn(["select", "data", "status"], "LOADING");
    }
    return state;
}

//segmentLoader --------------------------------------------------------------------
export function segmentLoader() { return { type: "SEGMENT_LOADER" }}
export function segmentLoaderReducer(state = {}, action, async, prevState) {
    if(action.type == "SEGMENT_LOADER") {
        console.debug("SEGMENT_LOADER");
        let query = Immutable.fromJS({
            select: state.getIn(["select", "config"]),
            segment: state.getIn(["segment", "config"]),
            summarize: {}
        });
        let api = state.getIn(["app", "api"]);
        console.log(query.toJSON());
        let promise = api.execute(query, {target: "segment"});
        async(promise, newSegmentData);
        state = state.setIn(["segment", "data", "status"], "LOADING");
    }
    return state;
}

//summaryLoader --------------------------------------------------------------------
export function summaryLoader(summary, segment, force) { return { type: "SUMMARY_LOADER", summary, segment, force }}
export function summaryLoaderReducer(state = {}, action, async, prevState) {
    if(action.type == "SUMMARY_LOADER") {
        console.debug("SUMMARY_LOADER");
        let query = Immutable.fromJS({
            select: state.getIn(["select", "config"]),
            segment: state.getIn(["segment", "config"]),
            summarize: state.getIn(["summarize", "config"])
        });

        let summary = action.summary.toJSON();
        let segment = action.segment.toJSON();

        let api = state.getIn(["app", "api"]);
        let promise = api.execute(query, {target: "summary", summary, segment});
        async(promise, newSummaryData);
        //state = state.setIn(["segment", "data", "status"], "LOADING");
    }
    return state;
}

//summariesLoader --------------------------------------------------------------------
export function summariesLoader(force) { return { type: "SUMMARIES_LOADER", force }}
export function summariesLoaderReducer(state = {}, action, async, prevState) {
    if(action.type == "SUMMARIES_LOADER") {
        console.debug("SUMMARIES_LOADER");
        let SummaryPath = ["summarize", "config"];
        for(let summary of state.getIn(SummaryPath).get("summaries")) {
            let segments = state.getIn(SummaryPath).get("segments");
            if(segments && segments.size > 0) {
                for (let segment of segments) {
                    state = summaryLoaderReducer(state, summaryLoader(summary, segment, action.force), async, prevState);
                }
            } else {
                state = summaryLoaderReducer(state, summaryLoader(summary, undefined, action.force), async, prevState);
            }
        }
    }
    return state;
}

//loadQuery --------------------------------------------------------------------
export function loadQuery() { return { type: "LOAD_QUERY" }}
export function loadQueryReducer(state, action, async, prevState) {
    if(action.type == "LOAD_QUERY") {
        console.debug("LOAD_QUERY", {prevState: prevState.toJS(), state: state.toJS()});

        let SelectPath = ["select", "config", "rules"];
        let SegmentPath = ["segment", "config"];
        let SummaryPath = ["summarize", "config"];

        if(!prevState || state.getIn(SelectPath) != prevState.getIn(SelectPath)){
            state = selectLoaderReducer(state, selectLoader(), async);
            state = segmentLoaderReducer(state, segmentLoader(), async, prevState);
            state = summariesLoaderReducer(state, summariesLoader(true), async, prevState);
        }


        else if(!prevState || state.getIn(SegmentPath) != prevState.getIn(SegmentPath)){
            state = segmentLoaderReducer(state, segmentLoader(), async, prevState);
            state = summariesLoaderReducer(state, segmentLoader(), async, prevState);
        }

        else if(!prevState || state.getIn(SummaryPath) != prevState.getIn(SummaryPath)){
            state = summariesLoaderReducer(state, summariesLoader(), async, prevState);
        }
    }
    return state;
}

//Init ---------------------------------------------------------
export function init() { return { type: "INIT"} }
export function initReducer(state = {}, action) {
    if(action.type == "INIT") {
        state = Immutable.fromJS({
            server: "disconnected"
        });
    }
    return state;
}

//Entry
export default function entry(state, action, async, prevState) {
    let reducers = [
        initReducer,
        loginReducer,
        connectReducer,
        apiReadyReducer,
        newSelectDataReducer,
        newSegmentDataReducer,
        newSummaryDataReducer,
        saveRuleReducer,
        removeRuleReducer,
        setSegmentReducer,
        addSummaryReducer,
        loadQueryReducer,
        selectSegmentReducer,
        removeSummaryReducer,
        removeSelectedSegmentReducer,
        mergeSegmentsReducer,
        splitSegmentReducer,
        removeKeyfromSummaryReducer,
        loadDocumentsReducer,
        newDocumentsDataReducer,
        clearDocumentsReducer,
        loadSelectInfoReducer,
        newFilterDataReducer,
        clearAllReducer
    ];
    for(let reducer of reducers) {
        state = reducer(state, action, async, prevState);
    }
    return state;
}
