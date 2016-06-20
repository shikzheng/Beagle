/**
 * Created by cristianfelix on 2/22/16.
 */
import React from 'react';
import Field from '../Title/Field'
import d3 from 'd3'
class FieldList extends React.Component {
    constructor() {
        super();
        this.state = {fieldFilter: ""};
    }
    getTitle(type) {
        let title = "";
        switch (type) {
            case "TEXT":
                return "Text Fields"
            case "CATEGORICAL":
                return "Structured Fields"
            case "DATE":
                return "Structured Fields"
            case "CONTINUOUS":
            case "QUANTITATIVE":
                return "Structured Fields"
            case "BOOLEAN":
                return "Structured Fields"
            case "GEO_US_ZIP":
            case "GEO_COUNTRY_NAMES":
                return "Structured Fields"
        }
        return "Other"
    }
    
    getTitleOrder(title) {
        switch (title) {
            case "Text Fields":
                return 1;
            case "Structured Fields":
                return 2;
            case "Other":
                return 3;
        }
    }

    render() {
        let {data, dispatch, api} = this.props;

        let style = {
            filterInput: {
                width: "100%"
            }
        };
        let fields = api.getFieldList().map((d) => {
            return Object.assign({}, d , {type_desc: api.getType(d.key)})
        }).filter((f) => f.key.indexOf("$nlp") == -1);
        
        let nlpFields = api.getFieldList().map((d) => {
            return Object.assign({}, d , {type_desc: api.getType(d.key)})
        }).filter((f) => f.key.indexOf("$nlp") > -1);
        
        let nested_data = d3.nest()
            .key(d => this.getTitle(d.type_desc))
            .entries(fields)
        nested_data.sort((a,b) => this.getTitleOrder(a.key) - this.getTitleOrder(b.key) );
        console.log(nested_data)
        
        return (
            <div>
                {nested_data.map(group => {
                    return <div key={group.key} style={{maxHeight: 400, marginBottom: 10, overflowY: "auto", overflowX: "hidden", border: "solid 1px #ccc"}}>
                    <div style={{fontSize: 12, backgroundColor: "#eee", fontWeight: "bold", padding: 5}}>{group.key}</div>
                    {group.values
                        .filter(field => field.key.indexOf(this.state.fieldFilter) > -1)
                        .map(field => <Field key={field.key} data={field}/>)}
                    </div>
                })}
                
                <div style={{maxHeight: 400, marginBottom: 10, overflowY: "auto", overflowX: "hidden", border: "solid 1px #ccc"}}>
                    <div style={{fontSize: 12, backgroundColor: "#eee", fontWeight: "bold", padding: 5}}>Structured Text Fields</div>
                    {nlpFields.map(field => <Field key={field.key} data={field}/>)}
                </div>
                
            </div>
        );
    }
}

FieldList.propTypes = {};
FieldList.defaultProps = {};

export default FieldList;

/* <input style={style.filterInput} type="search" placeholder="Filter" value={this.state.fieldFilter}
                       onChange={(e) => this.setState({fieldFilter: e.target.value})}/>*/