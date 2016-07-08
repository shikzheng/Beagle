/**
 * Created by cristianfelix on 12/31/15.
 */
import React from 'react';
import ClearBox from './../ClearBox'
import SelectRules from './SelectRules'
import SelectSamples from './SelectSamples'
import SelectStats from './SelectStats'
import Container from '../../Common/Container'
import {getDefaultOperation} from '../../../Data/api'
import Field from '../../Title/Field'
import Caption from './Caption'
import { DropTarget } from 'react-dnd';
import {ItemTypes} from '../../../definitions';

const selectRulesTarget = {
    drop(props,monitor, obj) {
        const item = monitor.getItem();
        obj.addRule(item);
        return { name: 'SelectRules' };
    }
};


@DropTarget([ItemTypes.FIELD], selectRulesTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
}))

class Select extends React.Component {
    constructor() {
        super();
        this.state = {categoriesSelected: []};
    }
    getStyle() {
        const { canDrop, isOver, connectDropTarget } = this.props;
        return {
            padding: 0,
            backgroundColor: isOver ? "#ccc" : (canDrop ? "#ddd" :undefined),
            display: "flex",
            height: 35,
            flexDirection: "row"
        }
    }

    addRule(field) {
        let {dispatch} = this.props;
        dispatch({type: "LOAD_SELECT_INFO", field});
        this.setState({addingRule: field});
    }

    removeRule(field) {
        console.log("Select.js",33, field);
        let {dispatch} = this.props;
        dispatch({type: "REMOVE_RULE", field});
    }

    saveRule() {
        let {addingRule} = this.state;
        let op = getDefaultOperation(addingRule.type_desc);

        let rule = {
            type: addingRule.type_desc,
            field: addingRule.key,
            op: op
        };

        switch (op) {
            case "in":
                rule.value = this.refs.ruleValue.value.split(/\n/).map(v => v.trim()).filter(v => v.length > 0);
                break;
            case "between":
                rule.value = [this.refs.ruleFrom.value, this.refs.ruleTo.value];
                break;
            case "contains":
                rule.value = this.refs.ruleValue.value.replace(/\n/, " ");
                break;
            case "is":
                rule.value = this.refs.ruleTrue.checked;
        }

        let {dispatch} = this.props;
        dispatch({type: "SAVE_RULE", rule});
        this.setState({addingRule: undefined, categoriesSelected: [], filterCategory:""});
    }

    renderModal() {
        let modalStyle = {
            position: "fixed",
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 1001,
            fontSize: 12,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            padding: 10,
            transition: "all 0.5s"
        };
        let {addingRule} = this.state;
        let op = getDefaultOperation(addingRule.type_desc);
        let {data, dispatch, api} = this.props;
        
        let renderWindow = () => {
            switch (addingRule.type_desc) {
                case "DATE":
                    return <div style={{marginTop: 10}}>
                        <div><label style={{ width: 40, display: "inline-block"}}>From:</label> <input ref="ruleFrom" type="text"/></div>
                        <div><label style={{ width: 40, display: "inline-block"}}>To:</label> <input ref="ruleTo" type="text"/></div>
                        <div style={{fontSize: 10, marginTop: 5}}><i>Format: yyyy-mm-dd</i></div>
                    </div>;
                case "CONTINUOUS":
                    return <div style={{marginTop: 10}}>
                        <div><label style={{ width: 40, display: "inline-block"}}>From:</label> <input ref="ruleFrom" type="text"/></div>
                        <div><label style={{ width: 40, display: "inline-block"}}>To:</label> <input ref="ruleTo" type="text"/></div>
                    </div>;
                case "QUANTITATIVE":
                    return <div style={{marginTop: 10}}>
                        <div><textarea ref="ruleValue" name="Text1" style={{width: 170, outline: "none", resize: "vertical"}} rows="5" ></textarea></div>
                        <div style={{fontSize: 10, marginTop: 5}}><i>Type values separated by comma (,)</i></div>
                    </div>;
                case "GEO_COUNTRY_NAMES":
                case "CATEGORICAL":
                    let catScale =  d3.scale.linear();
                    if(data.getIn(["config", "options"])) {
                        catScale = d3.scale.linear().range([1,150]).domain(d3.extent(data.getIn(["config", "options"]).toJSON(), d => d.selected))
                    } 
                    return <div style={{marginTop: 10}}>
                        <div><textarea 
                            ref="ruleValue" 
                            name="Text1" 
                            value={this.state.categoriesSelected.join("\n")}
                            style={{width: 170, outline: "none", resize: "vertical", display: "none"}} 
                            rows="5" ></textarea></div>
                        {/*<div style={{fontSize: 10, marginTop: 5}}><i>Type values separated by comma (,)</i></div>*/}
                        <div>
                            <label>Search: </label>
                            <input type="search" value={this.state.filterCategory} onChange={e => {this.setState({filterCategory: e.target.value })}} />
                        </div>
                        <div style={{ maxHeight: 480, boxShadow:"0px -4px 4px #eee inset", overflow:"auto", paddingBottom: 20, paddingTop: 5, width: 400 }}>
                            <table>
                                <tbody>
                                    {data.getIn(["config", "options"])? data.getIn(["config", "options"]).filter(item => {
                                        if(this.state.filterCategory && this.state.filterCategory.length > 0) {
                                            return item.get("key").toLowerCase().indexOf(this.state.filterCategory.toLowerCase()) > -1;
                                        } else {
                                            return true;
                                        }
                                    }).map(item => {
                                        return <tr key={item.get("key")}>
                                            <td><input type="checkbox" 
                                                value={this.state.categoriesSelected.indexOf(item.get("key")) > -1 ? "ckecked" : undefined}
                                                onClick={e => {this.setState((prevState) => {
                                                        let current = prevState.categoriesSelected;
                                                        if(current) {
                                                            let idx = current.indexOf(item.get("key"))
                                                            if(idx > -1) {
                                                                current.splice(idx, 1)
                                                            } else {
                                                                current.push(item.get("key"))
                                                            }
                                                            return { categoriesSelected: current };
                                                        } 
                                                        return { categoriesSelected: [item.get("key")] }
                                                    }
                                                )
                                            }} /></td>
                                            <td>{item.get("key")}</td>
                                            <td>
                                                <div style={{ width: catScale(item.get("selected")), height: 10, backgroundColor: "#ccc"}} ></div>
                                            </td>
                                        </tr>    
                                    }): undefined}
                                </tbody>
                            </table>
                        </div>
                    </div>;
                case "TEXT":
                    return <div style={{marginTop: 10}}>
                        <div><label style={{ width: 40, display: "inline-block"}}>Keywords:</label></div>
                        <div><textarea ref="ruleValue" name="Text1" style={{width: 170, outline: "none", resize: "vertical"}} rows="5" ></textarea></div>
                    </div>;
                case "BOOLEAN":
                    return <div style={{marginTop: 10}}>
                        <div><input type="radio" ref="ruleTrue" name="ruleValue"/> <label style={{ width: 40, display: "inline-block"}}>True</label> </div>
                        <div><input type="radio" ref="ruleFalse" name="ruleValue"/> <label style={{ width: 40, display: "inline-block"}}>False</label> </div>
                    </div>;
            }
            return <div></div>
        }

        return(
            <div style={modalStyle}>
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    backgroundColor: "white",
                    padding: 10
                }}>
                    <div style={{fontSize: 14, fontWeight: "bold", borderBottom: "solid 1px #ccc"}}>Add Rule</div>
                    <div>{addingRule.key} {op}:</div>
                    {renderWindow()}
                    <div style={{ marginTop: 10 }}>
                        <button
                            onClick={this.saveRule.bind(this)}
                            style={{backgroundColor: "#074563", border: "none", color: "white", outline: "none"}}>
                            Save
                        </button>
                        <button
                            onClick={(e) => {this.setState({addingRule: undefined, categoriesSelected: [], filterCategory: ""})}}
                            style={{backgroundColor: "white", border: "none", color: "#E0376D", outline: "none"}}>Cancel</button>
                    </div>
                </div>
            </div>
        )

    }

    render() {
        let {data, dispatch, api} = this.props;
        const { canDrop, isOver, connectDropTarget } = this.props;


        let loading = data.getIn(["data", "status"]) == "LOADING";
        let loadingStyle ={
            display: loading ? "block" : "none",
            position: "absolute",
            backgroundColor: "rgba(255,255,255,0.8)",
            fontSize: 20,
            zIndex: 10,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            textAlign: "center",
            paddingTop: 100
        };
        let titleStyle = { 
            fontWeight: "normal",
            color:this.props.color,
            padding: 5,
            fontSize: 20,
            margin: 0,
            borderBottom: "solid 1px #ccc",
            paddingTop: 8, 
            paddingLeft: 5,
            marginRight: 10
        }

        return connectDropTarget(
            <div style={this.getStyle()}>
                <div style={loadingStyle} >Loading</div>

                {this.state.addingRule ? this.renderModal() : ""}
                <div style={titleStyle}>Filter: </div>
                <SelectRules 
                    addRule={this.addRule.bind(this)}
                    onRemove={this.removeRule.bind(this)}
                    data={data.getIn(["config", "rules"])} />
                

                {data.getIn(["data", "stats"]) ? <SelectStats style={{position: "absolute", right: 0, top: 5}} data={data.getIn(["data", "stats"])} /> : undefined }
                
                


            </div>
        )
    }
}

Select.propTypes = {};
Select.defaultProps = {};

export default Select;

/*

*/