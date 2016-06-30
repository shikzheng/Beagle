/**
 * Created by Cristian Felix on 12/31/15.
 */
import React from 'react';
import ClearBox from './../ClearBox'
import Container from '../../Common/Container'
import EmailItem from './EmailItem'
import _ from 'lodash';
import { DropTarget } from 'react-dnd';
import {getDefaultSegmentOrder} from '../../../Data/api';
import {ItemTypes} from '../../../definitions'
import {mergeSegments, splitSegment} from '../../../reducers';

const segmentTarget = {
    drop(props,monitor, obj) {
        console.log("Email.js",13);
        const item = monitor.getItem();
        obj.setSegment(item);
        return { name: 'Email' };
    }
};

@DropTarget(ItemTypes.FIELD, segmentTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: true,
    canDrop: true
}))
class Email extends React.Component {
    constructor() {
        super();
        this.state = { segmentFilter: ""};
    }
    setSegment(item) {
        let {dispatch} = this.props;
        console.log("Email.js",29, item);
        let selectedKeys = undefined;
        if(item.type_desc == "TEXT"){
            selectedKeys = prompt("Type the words separated by comma (,)")
        }
        let Email = {
            field: item.key,
            merge: [],
            exclude: [],
            interval: item.type_desc == "DATE" ? "year" : 1,
            selectedKeys: selectedKeys ? selectedKeys.split(",").map(w => w.trim()) : selectedKeys,
            dateFormat: "yyyy",
            limit: 300,
            order: getDefaultSegmentOrder(item.type_desc)
        };
		console.log("LUCK :"+ item.key)
        dispatch({ type: "SET_SEGMENT", Email: Email })
    }

    split(item) {
        let {dispatch} = this.props;
        dispatch(splitSegment(item));
    }

    merge(s1, s2) {
        let {dispatch} = this.props;
        dispatch(mergeSegments(s1,s2));
    }



    render() {
        let {data, dispatch, canDrop, isOver, connectDropTarget, api} = this.props;
        let showField = "selected";
        let stats = {};
        let segments = data.getIn(["data", "segments"]);
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
        if(data.getIn(["data", "segments"]).size == 0) {
            let color = canDrop ? "#074563" : (isOver ? "red" : undefined);
            return connectDropTarget(<div>
                <div style={loadingStyle} >Loading</div>
            </div>);
        }


        stats.max = _.max(data.getIn(["data", "segments"]).toJSON(), showField);
        stats.max = data.getIn(["data", "segments"]).maxBy((item) => item.get(showField)).toJSON();
        let type = api.getType(data.getIn(["config", "field"]));

        let sentiment = ["Very Negative", "Negative", "Neutral", "Polarized", "Positive", "Very Positive"];

        if(data.getIn(["config", "field"]).indexOf("sentiment") > -1) {
            segments = segments.sortBy(a => sentiment.indexOf(a.get('key')))
        } else {
            segments = segments.sortBy(s => s.get("select"))
        }

        return connectDropTarget(
            <div style={{width: "100%"}}>
                <div style={loadingStyle} >Loading</div>
                <table>
                    <tbody>
                        <tr><td colSpan="2"></td><td style={{width: 10, fontSize: 12, borderLeft: "solid 1px #ccc"}}></td></tr>
                        {segments.filter(s => s.get("key").indexOf ? s.get("key").toLowerCase().indexOf(this.state.segmentFilter.toLowerCase()) > -1 : true ).map((s, idx) => {
                            let isMerge = data.getIn(["config", "merge"]);
                            if(isMerge) {
                                isMerge = isMerge.findIndex(m => m.get("label") == s.get("key")) > -1;
                            }
                            return <EmailItem
                                showField={showField}
                                split={this.split.bind(this)}
                                isMerge={isMerge}
                                merge={this.merge.bind(this)}
                                type={type}
                                key={s.get("key")}
                                data={s} stats={stats} />
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

Email.propTypes = {};
Email.defaultProps = {};

export default Email;