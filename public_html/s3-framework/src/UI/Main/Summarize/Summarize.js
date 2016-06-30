/**
 * Created by cristianfelix on 12/31/15.
 */
import React from 'react';
import ClearBox from './../ClearBox';
import Container from '../../Common/Container';
import SummaryRow from './SummaryRow';
import SummarizeLabels from './SummarizeLabels';
import immutable from 'immutable';
import { DropTarget } from 'react-dnd';
import {ItemTypes} from '../../../definitions'
import {selectSegment, removeSummary, removeSelectedSegment, removeKeyfromSummary, loadDocuments} from "../../../reducers"

const summarizeTarget = {
    drop(props,monitor, obj) {
        const item = monitor.getItem();
        if(monitor.getItemType() == ItemTypes.SEGMENT){
            obj.addSegment(item);
        } else if (monitor.getItemType() == ItemTypes.FIELD) {
            obj.addSummary(item);
        }

        return { name: 'Summarize' };
    }
};

@DropTarget([ItemTypes.SEGMENT, ItemTypes.FIELD], summarizeTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    item: monitor.getItemType(),
    canDrop: monitor.canDrop()
}))
export default class Summarize extends React.Component {
    getStyle() {
        return {
            display: "flex",
            flexGrow: 1,
            overflow: "auto",
        }
    }

    addSegment(segment) {
        let {dispatch} = this.props;
        dispatch(selectSegment(segment));
    }

    getDefaultSummary(type) {
        switch (type) {
            case "QUANTITATIVE": return "barChart";
            case "DATE": return "lineChart";
            case "CONTINUOUS": return "lineChart";
            case "CATEGORICAL": return "barChart";
            case "TEXT": return "wordCloud";
            case "BOOLEAN": return "barChart";
            case "GEO_COUNTRY_NAMES": return "worldMap";
            case "GEO_US_ZIP": return "worldMapLeaf";
        }
    }

    addSummary(summary) {
        let {dispatch} = this.props;
        summary = {
            field: summary.key,
            exclude: [],
            sampleBy: "count",
            show: "count",
            metrics: [],
            type: summary.type_desc,
            visualization: this.getDefaultSummary(summary.type_desc)
        };
        console.log("Summarize.js",48, summary);
        dispatch({ type: "SAVE_SUMMARY", summary});
    }

    onSelectKey(key, summary, segment) {
        let {dispatch} = this.props;
        console.log(key, summary.toJSON(), segment.toJSON());
        dispatch(loadDocuments(key, summary.get("field"), segment.get("label")));
    }

    removeKey(key, summary) {
        let {dispatch} = this.props;
        dispatch(removeKeyfromSummary(key, summary.get("field")));
    }

    renderEmpty() {
        let {canDrop, isOver, connectDropTarget} = this.props;
        let color = canDrop ? "#074563" : (isOver ? "red" : undefined);
        return connectDropTarget(<div></div>);
    }

    computeStyles() {
        let {data, dispatch, api, canDrop, isOver, connectDropTarget, item} = this.props;
        let color = canDrop ? "#074563" : (isOver ? "red" : undefined);

        let segments = data.getIn(['config', 'segments']);
        let summaries = data.getIn(['config', 'summaries']);

        let tableStyle = {
            borderCollapse: "collapse",
            tableLayout: "fixed"
        };

        let segColor = "linear-gradient(to right,#eee, #fefefe)";
        if(item == "SEGMENT") {
            segColor = "linear-gradient(to right,#55C94B, #fefefe)"
        }

        let sumColor = "linear-gradient(#eee, #fefefe)";
        if(item == "FIELD") {
            sumColor = "linear-gradient(#55C94B, #fefefe)"
        }
		
        return {sumColor, segColor, tableStyle, segments, summaries, color}
    }

    renderAll() {
        let {data, dispatch, api, canDrop, isOver, connectDropTarget, item} = this.props;
        let {sumColor, segColor, tableStyle, segments, summaries, color} = this.computeStyles();
		let SummaryData = data.getIn(["data", "summaries"]);
        return connectDropTarget(
            <div style={this.getStyle()}>
                <table style={tableStyle}>
                    <tbody>
                    <tr key="title">
                    </tr>
                    {summaries.map((summary) => {
                        let SummaryData = data.getIn(["data", "summaries"]);

                        if(SummaryData) {
                            SummaryData = SummaryData.filter(d => {
                                return d.get("summary") == summary.get("field") &&
                                segments.find((s) => {
                                    return s.get("label") === d.get("segment");
                                })
                            });
                        }
						
                        return (<SummaryRow key={summary.get("field")}
                                            type={summary.get("visualization")}
                                            summary={summary}
                                            onSelect={this.onSelectKey.bind(this)}
                                            onRemove={this.onRemoveSummary.bind(this)}
                                            removeKey={this.removeKey.bind(this)}
                                            segments={segments}
                                            data={SummaryData} />)
                    })}

                    </tbody>
                </table>

            </div>
        );
    }



    onRemoveSummary(summary) {
        let {dispatch} = this.props;
        dispatch(removeSummary(summary.get("field")));
    }

    onRemoveSegment(segment) {
        let {dispatch} = this.props;
        dispatch(removeSelectedSegment(segment.get("label")));
    }



    render() {
        let {data, dispatch, api, canDrop, isOver, connectDropTarget, item, segmentData} = this.props;

        if(data.getIn(["data", "summaries"]).size == 0 && data.getIn(["config", "segments"]).size == 0) {
            return this.renderEmpty();
        }
        if(data.getIn(["config", "segments"]).findIndex(s => s.get("label") == "_all") > -1){
            return this.renderAll();
        }
    }

}