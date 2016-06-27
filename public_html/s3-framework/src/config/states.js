/**
 * Created by cristianfelix on 12/26/15.
 */
import Immutable from 'immutable';

const defaultState = Immutable.fromJS({
    app: {},
    server: {
        config: {
            requirePassword: false,
            host: "vgc.poly.edu/projects/r2sense",
            index: "yelp",
            type: "reviews",
            mainText: "review.text",
            customMapping: {
                "business.postal_code": "GEO_US_ZIP",
                "user.zip": "GEO_US_ZIP"
            },
            ignore: [/aggs\..*/,
                /business.attributes\..*/,
                /business.hours\..*/,
                /business.latitude/,
                /business.longitude/,
                /business.neighborhoods/,
                /business.open/,
                /business.rating/,
                /business.review_count/,
                /business.stars/,
                /business.state/,
                /review.date/,
                /review.created/,
                /review.votes.*/,
                /business.phone/,
                /business.full_address/,
                /business.type/,
                /business.url/,
                /query.*/,
                /review.type/,
                /review.url/,
                /user.type/,
                /user.yelping_since/,
                /user.average_stars/,
                /user.votes.*/,
                /user.compliments.*/,
                
                /user.state/,
                /user.review_count/,
                /user.name/,
                /user.friends/,
                /.*\.id/, /.*_id/]},
        data: {}
    },
    select: {
        data: {
            status: "INITIAL",
            stats: { total: 0 },
            samples: []
        },
        config: {
            rules: []
        }
    },
    segment: {
        data: {
            status: "INITIAL",
            segments: []
        },
        config: {
            limit: 50,
            sort: "VALUE"
        }
    },
    summarize: {
        data: {
            status: "INITIAL",
            summaries: []
        },
        config: {
            segments: [],
            summaries:[]
        }
    },
    documents: {
        config: {},
        data: []
    }
});

const testState = Immutable.fromJS({
    app: {},
    server: {
        config: {},
        data: {}
    },
    select: {
        data: {
            status: "INITIAL",
            stats: { total: 0 },
            samples: []
        },
        config: {
            rules: [ { //Fetches data in a range
                    type: "quantitative",
                    field: "business.review_count",
                    op: "between",
                    value:[1, 5000]
                },
                { //Fetches data in a range
                    type: "date",
                    field: "review.created",
                    op: "between",
                    value: ["2010-01-01", "2016-01-10"]
                },
                {   //Fetches only the numbers in the array, list or specified
                    type: "CATEGORICAL",
                    field: "business.category",
                    op: "in",
                    value: ["Dentists", "Doctors", "Chiropractors"]
                },
                {   //Fetches only the numbers in the array
                    type: "TEXT",
                    field: "review.text",
                    op: "contains",
                    value: "wrong"
                },
                {
                    type: "BOOLEAN",
                    field: "review.hasResponse",
                    op: "is",
                    value: "true"
                }]
        }
    },
    segment: {
        data: {
            status: "INITIAL",
            segments: []
        },
        config: {
            field: "review.text",
            selectedKeys: ["prescription", "diagnostic", "doctor", "day"],
            interval: 1,
            dateFormat: "yyyy-MM",
            merge: [{
                label: "related",
                keys: ["prescription","diagnostic"]
            }],
            superpose: [4,5],
            exclude: [3],
            limit: 30,
            order: { "_term": "asc" }
        }
    },
    summarize: {
        data: {
            status: "INITIAL",
            summaries: []
        },
        config: {
            segments: [
                {label: "related", keys: ["prescription","diagnostic"]},
                {label: "doctor", keys: ["doctor"]}
            ],
            summaries:[{
                field: "business.category",
                exclude: [1,2],
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
    },
    documents: {
        config: {},
        data: []
    }
});

export const whsState = defaultState.setIn(['server', 'config'], Immutable.fromJS({
    requirePassword: false,
    host: "vgc.poly.edu/projects/es-gateway",
    index: "whs6",
    type:"document",
    mainText: "text",
    customMapping: {
        "National Context": "GEO_COUNTRY_NAMES"
    },
    ignore: [/terms\..*/]
}));

export const nursingState = defaultState.setIn(['server', 'config'], Immutable.fromJS({
    requirePassword: false,
    host: "localhost:9200",
    index: "nursing2",
    type:"inspection",
    mainText: "inspection_text"
}));

export const professorState = defaultState.setIn(['server', 'config'], Immutable.fromJS({
    requirePassword: false,
    host: "vgc.poly.edu/projects/r2sense",
    index: "ratemyprofessor",
    type:"documents",
    mainText: "document.text",
    ignore: [/terms\..*/]
}));


export const enronState = defaultState.setIn(['server', 'config'], Immutable.fromJS({
    requirePassword: false,
    host: "vgc.poly.edu/projects/es-gateway",
    index: "enron",
    type:"email",
    mainText: "contents",
    ignore: [
        /9/, 
        /^$/, 
        /!/, 
        /(lavorato's office)/, 
        /(maureen x31808)/, 
        /1 - */, 
        /3 - 3/, 
        /\?/, 
   //     /MONEY/, 
   //     /PERCENT/, 
   //     /TIME/, 
   //     /attendees/, 
   //     /bcc/, 
   //     /cc/, 
        /eb24c2/, 
        /eb3270/, 
        /eb32c2/, 
        /eb35c1/, 
        /friday, september 21st/, 
        /interconnect"/, 
        /mark's office */, 
        /ned, tess and alice/, 
        /oachim emanuelsson, vp - europe of kiodex/, 
        /pre-interview reception */, 
        /re/, 
        /room */, 
        /statute of limitations/, 
        /trading on eol/, 
        /wednesday,  september \n 19th/, 
        /your office */
    ]
}));



export const propublicaState = defaultState.setIn(['server', 'config'], Immutable.fromJS({
    requirePassword: true,
    host: "vgc.poly.edu/projects/es-gateway",
    //host: "localhost:9200",
    index: "yelp",
    type: "reviews",
    mainText: "review.text",
    customMapping: {
        "business.postal_code": "GEO_US_ZIP",
        "user.zip": "GEO_US_ZIP"
    },
    ignore: [
        /review\.previous_.*/,
        /review.id/,
        /review.url/,
        /review\.previous.*/,
        /user.id/,
        /business.country/,
        /business.id/,
        /business.rating/,
        /business.review_count/,
        /business.url/,
        /business.business_url/,
        /business.phone/
        ]
}));

export const propublicaStateStudy = defaultState.setIn(['server', 'config'], Immutable.fromJS({
    requirePassword: true,
    host: "vgc.poly.edu/projects/es-gateway",
    //host: "localhost:9200",
    index: "yelp",
    type: "reviews",
    mainText: "review.text",
    customMapping: {
        "business.postal_code": "GEO_US_ZIP"
    },
    ignore: [
        /review\.previous.*/,
        ///.*\.id/,
        /user.zip/,
        /review.id/,
        /review.response/,
        /review.url/,
        /review.hasResponse/,
        /user.city/,
        /user.id/,
        /user.name/,
        /business.country/,
        /business.id/,
        /business.rating/,
        /business.review_count/,
        /business.state/,
        /business.url/,
        /business.business_url/,
        /business.neighborhoods/,
        /business.phone/]
}));

export const propublicaNLPState = defaultState.setIn(['server', 'config'], Immutable.fromJS({
    requirePassword: true,
    //host: "vgc.poly.edu/projects/es-gateway",
    host: "localhost:9200",
    index: "yelp-nlp",
    type: "review",
    mainText: "review.text",
    customMapping: {
        "business.postal_code": "GEO_US_ZIP",
        "user.zip": "GEO_US_ZIP"
    },
    customOrder: {
        "$nlp.review_dot_text.sentiment": []
    },
    ignore: [
        /review\.previous_.*/,
        /review.id/,
        /review.url/,
        /review\.previous.*/,
        /user.id/,
        /business.country/,
        /business.id/,
        /business.rating/,
        /business.review_count/,
        /business.url/,
        /business.business_url/,
        /business.phone/,
        /.*tokens.Word/,
        /.*tokens.Positive/,
        /.*tokens.Negative/
    ]
}));

export const vitalsState = defaultState.setIn(['server', 'config'], Immutable.fromJS({
    requirePassword: true,
    host: "vgc.poly.edu/projects/es-gateway",
    //host: "localhost:9200",
    index: "vitals2",
    type: "review",
    mainText: "review.text",
    ignore: []
}));


export default {
    default: defaultState,
    professor: professorState,
    whs: whsState,
    enron: enronState,
    vitals: vitalsState,
    propublica: propublicaState,
    propublicanlp: propublicaNLPState,
    nursing: nursingState,
    //news: news
}


