/**
 * Created by cristianfelix on 1/8/16.
 */
import React from 'react';
import d3 from 'd3';
import {PRIMARY} from './style'

class BarChart extends React.Component {
    render() {
        let gridLineStyle = {};
        let {width, height, context, summary, data, highlight, showField, showOverall, sortBy} = this.props;
        if(!data) {
            return <div>Loading</div>
        }
        
        showField = showField || "segment";

        let roundMax = context.max > 10 ? Math.ceil(context.max / 10)*10 : context.max;

        let padding = 10;
        let axisWidth = Math.log10(roundMax)*10 + 20;

        let axisLabelStyle = {
            fontSize: 10
        };
        let barWidth = 10;
        let spaceWidth = 5;
        let marginTop = 5;
        let marginLeft = 5;
        let svgWidth = Math.max(data.get("data").size * (barWidth + spaceWidth), width-axisWidth-marginLeft);
        let spaceCharts = 20;
        
        let hasProportion = context.propMax != context.porpMin;
        console.log(hasProportion, context);

        let hasScroll = svgWidth > width-axisWidth-marginLeft;
        
        let propHeight = hasProportion ? 90 : 0;
        let barMaxHeight = height - 10 - propHeight - spaceCharts;

        let scale = d3.scale.linear().range([1,barMaxHeight]).domain([roundMax, 0]);

        let propScale = d3.scale.linear().range([1, propHeight]).domain([context.propMax, 0]);
        

        let avg = 0;
        if(context.propMax) {
            avg = data.get("data").map(a => a.get("proportion")).reduce((a, b) => a + b) / data.get("data").size;
        }
        
        let sentiment = ["Very Negative", "Negative", "Neutral", "Polarized", "Positive", "Very Positive"];
        let dataBars = data.get("data");
        
        if(summary.get("field").indexOf("sentiment") > -1) {
            dataBars = dataBars.sort((a,b) => sentiment.indexOf(a.get('key')) - sentiment.indexOf(b.get("key")))
        } else if (summary.get("type") != "QUANTITATIVE") {
            {
                if(sortBy == "Count") {
                    dataBars = dataBars.sort((a,b) => b.get(showField) - a.get(showField))
                } else if (sortBy == "Proportion") {
                    dataBars = dataBars.sort((a,b) => b.get("proportion") - a.get("proportion"))
                } else if (sortBy == "Alphabetically") {
                    dataBars = dataBars.sort((a,b) => d3.ascending(a.get("key"), b.get("key")))
                }
            }
        }
        
        
        let renderResult = (
            <div style={{whiteSpace: "no-wrap"}}>
                <svg width={axisWidth} height={height}>
                    <text dy={marginTop + 3} dx={axisWidth - 5} style={axisLabelStyle} textAnchor="end">{roundMax}</text>
                    <text dy={barMaxHeight/2 + marginTop +3} dx={axisWidth - 5} style={axisLabelStyle} textAnchor="end">{Math.floor(roundMax/2)}</text>
                    <text dy={barMaxHeight+ marginTop +3} dx={axisWidth - 5} style={axisLabelStyle} textAnchor="end">0</text>
                    
                    <text dy={barMaxHeight+ marginTop +3 - 50} dx={axisWidth - 5+35} style={axisLabelStyle} textAnchor="start" transform={`rotate(-90,${axisWidth - 5},${barMaxHeight+ marginTop +3})`}>Count</text>
                    <text dy={barMaxHeight+ marginTop +3 - 50} dx={axisWidth - 5-85} style={axisLabelStyle} textAnchor="start" transform={`rotate(-90,${axisWidth - 5},${barMaxHeight+ marginTop +3})`}>Proportion</text>
                    
                    {isNaN(context.propMax) || !hasProportion  ? undefined : <line x1="0" y1={spaceCharts/2 +  marginTop + barMaxHeight} y2={spaceCharts/2 + barMaxHeight+ marginTop} x2={svgWidth} style={{stroke: "#999"}} />}
                    
                    {isNaN(context.propMax) || !hasProportion  ? undefined : <text dy={spaceCharts + barMaxHeight+ marginTop + 3} dx={axisWidth - 5} style={axisLabelStyle} textAnchor="end">{(context.propMax *100).toFixed(1) + "%"}</text>}
                    {isNaN(context.propMax) || !hasProportion  ? undefined : <text dy={spaceCharts + barMaxHeight+ marginTop + propHeight/2 +3} dx={axisWidth - 5} style={axisLabelStyle} textAnchor="end">{(context.propMax/2 *100).toFixed(1) + "%"}</text>}
                    {isNaN(context.propMax) || !hasProportion  ? undefined : <text dy={spaceCharts + barMaxHeight+ marginTop + propHeight +3} dx={axisWidth - 5} style={axisLabelStyle} textAnchor="end">{(0 *100).toFixed(1) + "%"}</text>}
                    
                    {isNaN(context.propMax) || !hasProportion  ? undefined : <text fill="#E0376D" dy={spaceCharts + barMaxHeight+ marginTop + propScale(avg) + 2} dx={axisWidth - 0} style={axisLabelStyle} textAnchor="end">avg</text>}
                </svg>
                <div style={{overflowY: "hidden", overflowX: "auto",
                    width: width - axisWidth - marginLeft,
                    height:height ,
                    display:"inline-block",
                    boxShadow: hasScroll? "inset -5px -0px 5px #eee": undefined}}>
                    <svg height={height} width={svgWidth}>
                        <line x1="0" y1={marginTop} y2={marginTop} x2={svgWidth} style={{stroke: "#ccc"}} />
                        <line x1="0" y1={barMaxHeight/2 + marginTop} y2={barMaxHeight/2 + marginTop} x2={svgWidth} style={{stroke: "#ccc"}} />

                        {isNaN(context.propMax) || !hasProportion ? undefined : <line x1="0" y1={spaceCharts/2 +  marginTop + barMaxHeight} y2={spaceCharts/2 + barMaxHeight+ marginTop} x2={svgWidth} style={{stroke: "#999"}} />}
                        
                        {isNaN(context.propMax) || !hasProportion  ? undefined : <line x1="0" y1={spaceCharts +  marginTop + barMaxHeight} y2={spaceCharts + barMaxHeight+ marginTop} x2={svgWidth} style={{stroke: "#ccc"}} />}
                        {isNaN(context.propMax) || !hasProportion  ? undefined : <line x1="0" y1={spaceCharts +  marginTop + barMaxHeight + propHeight/2} y2={spaceCharts + barMaxHeight+ marginTop + propHeight/2} x2={svgWidth} style={{stroke: "#ccc"}} />}
                        {isNaN(context.propMax) || !hasProportion  ? undefined : <line x1="0" y1={spaceCharts +  barMaxHeight+ marginTop + propHeight} y2={spaceCharts + barMaxHeight+ marginTop  + propHeight} x2={svgWidth} style={{stroke: "#ccc"}} />}
                        <g>
                            {dataBars.map((d,i) => {
                                let fill = highlight == d.get("key") ? "red": PRIMARY;
                                
                                return <g key={d.get("key")}>
                                    <rect
                                        style={{transition: "height 0.2s", display: showOverall ? "block" : "none"}}
                                        fill={ isNaN(context.propMax) ? fill : "#ccc"} x={i*15+5} width={barWidth} y={scale(d.get("overall")) + marginTop}
                                        height={barMaxHeight - scale(d.get("overall"))}>
                                    </rect>
                                    { isNaN(context.propMax) ? undefined : <rect
                                        style={{transition: "height 0.2s"}}
                                        fill={highlight  == d.get("key") ? "red" : "#A9E2A4"} x={i*15+5} width={barWidth} y={spaceCharts + barMaxHeight + marginTop + propScale(d.get("proportion"))}
                                        onMouseEnter={() => this.props.onOver(d.get("key"))}
                                        onMouseLeave={this.props.onOut}
                                        onClick={() => this.props.onSelect(d.get("key"))}
                                        height={propHeight - propScale(d.get("proportion"))}>
                                    </rect>}
                                    { false ? undefined : <rect
                                        style={{transition: "height 0.2s"}}
                                        fill={fill} x={i*15+5} width={barWidth} y={scale(d.get(showField)) + marginTop}
                                        onMouseEnter={() => this.props.onOver(d.get("key"))}
                                        onMouseLeave={this.props.onOut}
                                        onClick={() => this.props.onSelect(d.get("key"))}
                                        
                                        height={barMaxHeight - scale(d.get(showField))}>
                                    </rect> }
                                </g>
                            })}
                        </g>
                        {isNaN(context.propMax) ? undefined : <g transform={`translate(0,${spaceCharts + barMaxHeight+ marginTop + propScale(avg)})`}>
                            <line x1="0" y1={0} y2={0} x2={svgWidth} style={{stroke: "#E0376D", strokeWidth: 1, opacity:0.5}} />
                        </g>}
                        <line x1="0" y1={barMaxHeight+ marginTop} y2={barMaxHeight+ marginTop} x2={svgWidth} style={{stroke: "#ccc", strokeWidth: 1}} />
                    </svg>
                </div>
            </div>
        );
        return renderResult;
    }
}

BarChart.propTypes = {};
BarChart.defaultProps = {};

export default BarChart;
