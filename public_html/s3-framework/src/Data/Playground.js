import React from 'react';
import Editor from './Editor'
import {defaultQuery} from './DefaultState';
import API from './api';
import Immutable from  'immutable';
class Playground extends React.Component {
    constructor(){
        super();
        this.state = {query: defaultQuery, elasticQuery: ""};
        this.api = new API("vgc.poly.edu/projects/es-gateway","yelp", "reviews", "review.text", [
            /review\.previous.*/,
            /.*\.id/,
            /business.business_url/,
            /business.neighborhoods/,
            /business.phone/,
            /business.postal_code/ ], "PeoYurlUci");
        this.api.loaded.then(() => {
            this.setState({
                ready: true,
                fields: this.api.getFieldList().map(f => { return { field:f.key, type:this.api.getType(f.key) } })
            });
            this.onRun(defaultQuery);
        });
    }

    onRun(query) {
        let compile = this.api.compiler.compile.bind(this.api.compiler);
        let elasticQuery = {
            select: compile(Immutable.fromJS(query), {target: "select"}),
            segment: compile(Immutable.fromJS(query), {target: "segment"})
        };

        if(query.summarize && query.summarize.summaries) {
            for(let summary of query.summarize.summaries) {
                elasticQuery["summary_" + summary.field + "|all"] =
                    compile(Immutable.fromJS(query), {
                        target: "summary",
                        segment: undefined,
                        summary: summary
                    });
                for(let segment of query.summarize.segments) {
                    elasticQuery["summary_" + summary.field + "|" + segment.label] =
                        compile(Immutable.fromJS(query), {
                            target: "summary",
                            segment: segment,
                            summary: summary
                        });
                }
            }
        }

        this.setState({
            query: query,
            elasticQuery
        });

        for(let key in elasticQuery) {
            this.api.query(elasticQuery[key], {}, Immutable.fromJS(query)).then(result => {
                if(result) {
                    console.log(key, result);
                }
            });
        }
    }

    render() {
        if(!this.state.ready) return <div>Loading</div>;
        let {query, elasticQuery} = this.state;
        return (
            <div>
                <div style={{float: "left"}}>
                    <Editor height="100%" value={query} fields={this.state.fields} run={this.onRun.bind(this)} />
                </div>
                <div>
                    <Editor height="100%"  value={elasticQuery} readOnly="true" id="QUERYEditor" />
                </div>
            </div>
        )
    }
}
export default Playground;
