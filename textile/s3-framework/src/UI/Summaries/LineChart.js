/**
 * Created by cristianfelix on 1/8/16.
 */
import React from 'react';
import d3 from 'd3';
import {PRIMARY} from './style'

class LineChart extends React.Component {
    render() {
        let gridLineStyle = {};
        let {width, height, context, summary, data, highlight, showField, showOverall} = this.props;
        if(!data) {
            return <div>Loading</div>
        }


        let roundMax = context.max > 10 ? Math.ceil(context.max / 10)*10 : context.max;

        let padding = 10;
        let axisWidth = Math.log10(roundMax)*10;

        let axisLabelStyle = {
            fontSize: 10
        };
        let pont = 10;
        let spaceWidth = 5;
        let marginTop = 5;
        let marginLeft = 5;
        let svgWidth = width-axisWidth-marginLeft;

        let hasScroll = svgWidth > width-axisWidth-marginLeft;


        let propHeight = isNaN(context.propMax) ? 0 : 90;
        let marginCharts = isNaN(context.propMax) ? 0 : 30;
        let barMaxHeight = height - 20 - marginCharts - propHeight;

        let scale = d3.scale.linear().range([1,barMaxHeight]).domain([roundMax, 0]);
        let xScale = d3.scale.linear().range([axisWidth,width - 5]).domain([0, data.get("data").size-1]);
            //width-axisWidth-marginLeft
        let propScale = d3.scale.linear().range([propHeight,1]).domain([0, context.propMax]);

        let line = d3.svg.line()
                .x((d, i) => { return xScale(i) ; })
                .y((d, i) => scale(d.segment || d.overall)+3);

        let path = line(data.toJSON().data);

        let lineOverall = d3.svg.line()
            .x((d, i) => { return xScale(i) ; })
            .y((d, i) => scale(d.overall) +3);

        let pathOverall = lineOverall(data.toJSON().data);

        let lineProportion = d3.svg.line()
            .x((d, i) => { return xScale(i) ; })
            .y((d, i) => propScale(d.proportion));

        let pathProportion = lineProportion(data.toJSON().data);

        let midIndex = data.get("data").size % 2 == 0 ? data.get("data").size / 2 :  Math.floor(data.get("data").size / 2);
        let midValue = data.get("data").get(midIndex).get("key");


        let renderResult = (
            <div style={{whiteSpace: "no-wrap"}}>
                <div style={{overflowY: "hidden", overflowX: "auto",
                    width: width - marginLeft,
                    height:height ,
                    display:"inline-block",
                    boxShadow: hasScroll? "inset -5px -0px 5px #eee": undefined}}>
                    <svg height={height} width={width}>
                        <text dy={marginTop + 3} dx={axisWidth - 5} style={axisLabelStyle} textAnchor="end">{roundMax}</text>
                        <text dy={barMaxHeight/2 + marginTop +3} dx={axisWidth - 5} style={axisLabelStyle} textAnchor="end">{Math.floor(roundMax/2)}</text>
                        <text dy={barMaxHeight+ marginTop +3} dx={axisWidth - 5} style={axisLabelStyle} textAnchor="end">0</text>
                        {isNaN(context.propMax) ? null : <text 
                            dy={barMaxHeight + marginTop + marginCharts+3} 
                            dx={axisWidth - 5} 
                            style={axisLabelStyle} 
                            textAnchor="end">{(context.propMax *100).toFixed(1) + "%"}</text>}
                            
                        {isNaN(context.propMax) ? null : <text 
                            dy={barMaxHeight + marginTop + marginCharts+6 + barMaxHeight/2} 
                            dx={axisWidth - 5} 
                            style={axisLabelStyle} 
                            textAnchor="end">{(context.propMax *100 /2).toFixed(1) + "%"}</text>}


                        <line x1={axisWidth} y1={marginTop} y2={marginTop} x2={width} style={{stroke: "#ccc"}} />
                        <line x1={axisWidth} y1={barMaxHeight/2 + marginTop} y2={barMaxHeight/2 + marginTop} x2={width} style={{stroke: "#ccc"}} />
                        <line x1={axisWidth} y1={barMaxHeight+ marginTop} y2={barMaxHeight+ marginTop} x2={width} style={{stroke: "#999", strokeWidth: 2}} />
                        
                        {/* Vertical lines Top */}
                        <line strokeDasharray="5,5" x1={axisWidth} y1={marginTop} y2={barMaxHeight+ marginTop +3} x2={axisWidth} style={{stroke: "#ccc", strokeWidth: 1}} />
                        <line strokeDasharray="5,5" x1={width-marginLeft} y1={marginTop} y2={barMaxHeight+ marginTop +3} x2={width-marginLeft} style={{stroke: "#ccc", strokeWidth: 1}} />
                        <line strokeDasharray="5,5" x1={xScale(midIndex)} y1={marginTop} y2={barMaxHeight+ marginTop +3} x2={xScale(midIndex)} style={{stroke: "#ccc", strokeWidth: 1}} />
                        
                        {/* Vertical lines Bottom */}
                        <line strokeDasharray="5,5" x1={axisWidth} y1={barMaxHeight + marginTop + marginCharts} y2={height - 10} x2={axisWidth} style={{stroke: "#ccc", strokeWidth: 1}} />
                        <line strokeDasharray="5,5" x1={width-marginLeft} y1={barMaxHeight + marginTop + marginCharts} y2={height - 10} x2={width-marginLeft} style={{stroke: "#ccc", strokeWidth: 1}} />
                        <line strokeDasharray="5,5" x1={xScale(midIndex)} y1={barMaxHeight + marginTop + marginCharts} y2={height - 10} x2={xScale(midIndex)} style={{stroke: "#ccc", strokeWidth: 1}} />


                        <g>
                            <path d={pathOverall} style={{stroke: "#ddd", fill:"none", strokeWidth: 2, display: showOverall ? "block" : "none"}} />
                            <path d={path} style={{stroke: PRIMARY, fill:"none", strokeWidth: 2}} />

                            { isNaN(context.propMax) ? null : <g transform={`translate(0,${barMaxHeight + marginTop + marginCharts})`}>
                                <path d={pathProportion} style={{stroke: "#A9E2A4", fill:"none", strokeWidth: 2}} />
                                <line x1={axisWidth} y1={0} y2={0} x2={width} style={{stroke: "#ccc", strokeWidth:1}} />
                                <line x1={axisWidth} y1={propHeight/2} y2={propHeight/2} x2={width} style={{stroke: "#ccc", strokeWidth:1}} />
                                <line x1={axisWidth} y1={propHeight} y2={propHeight} x2={width} style={{stroke: "#999", strokeWidth: 2}} />

                            </g>}
                            <g transform={`translate(0,${barMaxHeight + marginTop + marginCharts})`}>
                                <text dx={xScale(0)} y={propHeight + 11} textAnchor="middle" style={{fontSize: 10, fontWeight: "bold"}}>{data.getIn(["data",0,"key"])}</text>
                                <text dx={xScale(xScale.domain()[1])} y={propHeight + 11} textAnchor="end" style={{fontSize: 10, fontWeight: "bold"}}>{data.getIn(["data",data.get("data").size-1,"key"])}</text>
                                <text dx={xScale(midIndex)} y={propHeight + 11} textAnchor="middle" style={{fontSize: 10, fontWeight: "bold"}}>{midValue}</text>
                            </g>
                        </g>

                    </svg>
                </div>
            </div>
        );
        return renderResult;
    }
}

LineChart.propTypes = {};
LineChart.defaultProps = {};

export default LineChart;
