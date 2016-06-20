/**
 * Created by cristianfelix on 2/3/16.
 */


//Select
const SelectTest = {
    "select": {
        "rules": [
            {
                "field": "review.text",
                "op": "contains",
                "value": "wrong"
            }
        ]
    },
    "segment": {},
    "summarize": {}
};
//Segment


    /*  Segment
    *  Summary
    *  Select + Summary
    *  Select + Segment
    *  Segment + Summary
    *  Select + Summary + Segment
    * */
//"CATEGORICAL", "TEXT", "QUANTITATIVE", "CONTINUOUS", "DATE", "BOOLEAN", "BINARY"




const aggregations = {

};




export const otherQuery = {
    "select": {
        "rules": []
    },
    "segment": {

    },
    "summarize": {
        segments: [
            {label: "related", keys: ["prescription", "diagnostic"]},
            {label: "doctor", keys: ["doctor"]}
        ],
        summaries: [{
            field: "business.category",
            exclude: [1, 2],
            sampleBy: "count",
            metrics: [{
                label: "Average rating",
                metric: "avg",
                metricField: "rating"
            }],
            visualization: "barChart",
            localSort: "Average rating"
        }]
    }
};



export const dateQuery = {
        "select": {
        "rules": [
            {
                "field": "review.text",
                "op": "contains",
                "value": "wrong AND bad"
            }
        ]
    },
        "segment": {
        "field": "review.created",
        "interval": "month"
    },
        "summarize": {
            segments: [
                {label: "11/2004"},
                {label: "10/2004"}
            ],
            "summaries": [
            {
                "field": "business.category"
            }
        ]
    }
};


export const segmentQuery ={
    "select": {
        "rules": [{
            "field": "review.text",
            "op": "contains",
            "value": "wrong AND bad"
        }]
    },
    "segment": {
        "field": "review.rating",
        "interval": 1,
        "merge": [{
            "label": "low",
            "keys": [1,2]
        },
        {
            "label": "high",
            "keys": [4,5]
        }]
    },
    "summarize": {
        segments: [
            {label: "low", keys: [1,2]},
            {label: "3", keys: [3]},
            {label: "high", keys: [4,5]}
        ],
        summaries: [{
            field: "business.category",
        }]
    }
};

export const defaultSelect = {
    "select": {
        "rules": [
            {
                "field": "business.state",
                "op": "in",
                "value": [
                    "NY",
                    "NJ"
                ]
            },
            {
                "field": "business.rating",
                "op": "between",
                "value": [1,10]
            },
            {
                "field": "review.text",
                "op": "contains",
                "value": "wrong AND bad"
            },
            {
                "field": "review.hasResponse",
                "op": "is",
                "value": true
            },
            {
                "field": "review.rating",
                "op": "in",
                "value": [1,3]
            },
            {
                "field": "review.created",
                "op": "between",
                "value": ["2016-01-01", "2016-02-25"]
            }
        ]
    },
    "segment": "",
    "summarize": ""
};

export const defaultQuery = segmentQuery;