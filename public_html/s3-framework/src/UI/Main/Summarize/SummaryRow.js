/**
 * Created by cristianfelix on 1/8/16.
 */
import React from 'react';
import Summary from './Summary';
import d3 from 'd3';
import ConfigWindow from '../../Common/ConfigWindow'
import _ from 'lodash';
import ToolTip from './ToolTip';

class SummaryRow extends React.Component {
    constructor() {
        super();
        this.state = {
            summaryWidth: "80%",
            summaryHeight: "30%",
            show: "summaries",
            showOverall: false,
            fieldColor: "proportion",
            min_count: 1
        };
        this.prevState = this.state;
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state != this.nextState) {
            return true;
        }
        return (
            this.props.segments != nextProps.segments ||
            this.props.data != nextProps.data ||
            this.props.segmentsInfo != nextProps.segmentsInfo
        )
    }

    getContext(showField, fieldColor, data) {
        data = data.toJSON();
        let baseScale = this.state.showOverall ? "overall" : "segment";
        let max = d3.max(data, (d) => d3.max(d.data, (e) =>  e[baseScale]));
        let min = d3.min(data, (d) => d3.min(d.data, (e) =>  e[baseScale]));

        let propMax = d3.max(data, (d) => d3.max(d.data, (e) =>  e["proportion"]));
        let porpMin = d3.min(data, (d) => d3.min(d.data, (e) =>  e["proportion"]));

        let keys = data.map(d => d.data.map(w => w.key));
        let unique = _.xor.apply(this, keys);


        //data.map(d => d.data.map(w => w.key));

        return {max, min, unique, propMax, porpMin};
    }

    onHighlight(label, pos) {
        let selectedKeys = this.state.data.map(seg => {
            let s = seg.get("data").filter(k => k.get("key") == label).first();
            if(s) {
                return s.set("segmentKey", seg.get("segment"));
            }
        }).filter(k => k);
        this.setState({highlight: label, selectedKeys: selectedKeys})
    }

    onUnHighlight(e) {
        this.setState({highlight: undefined, toolTipX: -100, toolTipY:-200, selectedKeys: undefined})
    }

    onSelect() {

    }

    setMinCount(min_count, data = this.state.origData) {
        console.log(data.toJSON(), min_count, data.map(seg => seg.update("data", (data) => data.filter(d=> d.get("segment") > min_count))).toJSON());
        this.setState({
            min_count: min_count,
            data: data.map(seg => seg.update("data", (data) => data.filter(d=> d.get("segment") > min_count)))
        });
    }

    prepareData() {

    }

    setData(current, next) {
        let {segments, data, segmentsInfo} = current.props;
        let {min_count} = current.state;

        let newData = data;
        let selectedKeys = undefined;
        if(next) {
            let {nxSegments, nxData, nxSegmentsInfo, nxHighlight} = next.props;
            let {nxMin_count} = next.state;

            newData = nxData;
            if(
                nxData && (
                segments != nxSegments ||
                nxData != data ||
                nxSegmentsInfo != segmentsInfo ||
                nxMin_count != min_count)) {
                    newData = nxData.map(seg => seg.update("data", (data) => data.filter(d=> d.get("count") > this.state.min_count) ));
            }


        } else {
            newData = newData.map(seg => seg.update("data", (data) => data.filter(d=> d.get("count") > this.state.min_count) ));
        }
       return {
            selectedKeys: selectedKeys,
            data: newData
        }
    }


    componentWillMount() {
        this.setState({
            data: this.props.data
        });

    }

    componentWillReceiveProps(nextProps) {
        if(!this.state.sortBy) {
            let sort = nextProps.type == "wordCloud" ? "Proportion" : "Count";
            this.setState({
                sortBy: sort
            });
        }
        this.setState({
            data: nextProps.data,
            origData: nextProps.data
        });
        if(nextProps.data) {
            this.setMinCount(this.state.min_count, nextProps.data);
        }
    }



    showConfig(e) {
        this.setState({show: "config"});
    }

    renderSummaries() {
        let {summary, segments, type, onSelect, removeKey, segmentsInfo} = this.props;
        let {summaryWidth, summaryHeight, highlight, showField, fieldColor, data, selectedKeys} = this.state;

        return segments.map(segment => {
            return (
                <td>{summary.get("field")}

                    <Summary height={summaryHeight}
                             width={summaryWidth}
                             segmentCount={segments.size}
                             segment={segment}
                             summary={summary}
                             onOver={this.onHighlight.bind(this)}
                             onOut={this.onUnHighlight.bind(this)}
                             onSelect={(summaryKey) => onSelect(summaryKey, summary, segment)}
                             remove={(key) => removeKey(key, summary)}
                             highlight={highlight}
                             type={type}
                             showField={showField}
                             showOverall={this.state.showOverall}
                             sortBy={this.state.sortBy}
                             fieldColor={fieldColor}
                             min_count={this.state.min_count}
                             data={data.find(d => d.get("segment") == segment.get("label"))}
                             provider={this.state.mapType}
                             context={this.getContext(showField, fieldColor, data)}/>
			</td>)
        })
    }
    renderConfigCategorical() {
        let {summary, segments, data, type, onSelect, removeKey} = this.props;
        let {summaryWidth, summaryHeight, highlight, showField, fieldColor} = this.state;
		summaryHeight = "30%";
        console.log(this.props);
        let labelStyle = {
            width: 100,
            display: "inline-block"
        };
        /*

         case "barChart":
                return (<BarChart {...props} />);
            case "wordCloud":
                return (<WordCloud {...props} />);
            case "lineChart":
                return <LineChart {...props} />
            case "worldMap":
                return <WorldMap2 {...props} />
            case "worldMapLeaf":
                return <WorldMap {...props} />
        */

        return segments.map((segment, i) => {
            if(i > 0) {
                return <td style={{borderLeft: "solid 1px #ccc", borderBottom: "solid 1px #ccc"}} key={segment.get("label")} > </td>
            }
            return (
                <td style={{borderLeft: "solid 1px #ccc", borderBottom: "solid 1px #ccc", paddingLeft: 20, fontSize:12}} key={segment.get("label")} >
                    { ["barChart", "wordCloud"].indexOf(type) > - 1 ? <div>
                        <input type="checkbox" checked={this.state.showOverall} onChange={(e) => this.setState({ showOverall: e.target.checked }) }/><label style={labelStyle}>Show Overall </label>

                    </div> : undefined }
                    <div>
                        <label
                            style={labelStyle}>Min Count: </label><input
                            type="text"
                            value={this.state.min_count}
                            onBlur={(e) => this.setMinCount(e.target.value) }
                            onChange={(e) => this.setState({min_count:e.target.value})}/>
                    </div>
                    { ["barChart", "wordCloud"].indexOf(type) > - 1 ? <div>
                        <label style={labelStyle}>Sort by: </label>
                        <select value={this.state.sortBy} onChange={(e) => this.setState({ sortBy: e.target.value })}>
                            <option value="Count">Count</option>
                            <option value="Proportion">Proportion/Score</option>
                            <option value="Alphabetically">Alphabetically</option>
                        </select>
                    </div> : undefined}
                    { ["worldMapLeaf"].indexOf(type) > - 1 ? <div>
                        <label style={labelStyle}>Map Background</label>
                        <select value={this.state.mapType} onChange={(e) => this.setState({ mapType: e.target.value })}>
                            <option value="noLabels">No Labels</option>
                            <option value="Satellite">Satelite</option>
                            <option value="withLabels">Labeled</option>
                        </select>
                    </div> : undefined}
                    <div style={{marginTop: 10}}>
                        <button
                            onClick={(e) => this.setState({ show: "summaries"})}
                            style={{backgroundColor: "#074563", border: "none", color: "white", outline: "none"}}>
                            Close
                        </button>
                    </div>
                </td>)
        })
    }

    render() {
        let {summary, segments, data, type, onSelect, removeKey} = this.props;
        let {summaryWidth, summaryHeight, highlight, show} = this.state;



        summaryHeight = "30%";
        let titleProps = {
            style: {
                height: summaryHeight,
                width: 0
            }
        };
        let titleTextProps = {
            y: titleProps.style.width /2,
            x: -titleProps.style.height /2,
            transform: "rotate(-90)",
            textAnchor: "middle"
        };

        let removeTextProps = {
            y: 3,
            x: -13,
            fontSize: 10,
            transform: "rotate(-90)",
            textAnchor: "end"
        };

        let segmentProps = {};
        let summaryProps = {};
        let fieldDesc = summary.get("field");
        if(fieldDesc.indexOf("$nlp") > -1) {
            let parts = fieldDesc.split(".");
            fieldDesc = parts.splice(2,2).join(".")
        }
        return (
            <tr>
                <td>
                    <svg {...titleProps} >
                        <text {...titleTextProps}>{fieldDesc}</text>
                        <foreignObject {...removeTextProps}>
                            <i className="fa fa-trash-o" onClick={() => this.props.onRemove(summary)}></i>
                            <i className="fa fa-cog" onClick={this.showConfig.bind(this)}></i>
                        </foreignObject>
                    </svg>
                </td>
                {show == "config" ? this.renderConfigCategorical() : this.renderSummaries()}
            </tr>
        );
    }
}

SummaryRow.propTypes = {};
SummaryRow.defaultProps = {};

export default SummaryRow;
