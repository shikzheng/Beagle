/**
 * Created by cristianfelix on 1/8/16.
 */
import React from 'react';
import cloud from 'd3-cloud';
import {PRIMARY, PRIMARY_VERY_LIGHT} from './style';
import Word from './Word'
import d3 from 'd3';

class WordCloud extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    computeLayout(props = this.props) {
        if(!props.data || !props.data.get("data")){
            return;
        }
        let {width, height, showField} = props;

        let words = props.data.get("data").toJSON();

        let scale = d3.scale.linear()
            .range([10,20])
            .domain(d3.extent(words, (word) => word[showField]));

        cloud().size([width,height])
            .words(words)
            .padding(5)
            .rotate(function() { return 0; })
            .font("Helvetica")
            .text((d) => d.key)
            .random(() => 0.5)
            .fontSize(function(d) { return scale(d[showField]); })
            .on("end", (result) => {
                this.setState({layout: result, status: "done"});
            })
            .start();
        this.setState({status: "computing"});
    }

    componentWillMount() {
        this.computeLayout();
    }

    componentWillReceiveProps(nextProps) {
        if(this.shouldComponentUpdate(nextProps)) {
            //this.computeLayout(nextProps);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
        //return nextProps.data != this.props.data || nextProps.context != this.props.context;
    }

    isExclusive(key){
        let {width, height, data, context} = this.props;
        return context.unique.indexOf(key) > -1;
    }

    render() {
        let {width, height, data, context, highlight, showField, segment, segmentCount, sortBy} = this.props;
        let containerStyle = {
            overflow: "auto",
            WebkitColumnCount: 4,
            WebkitColumnGap: 0,
            width, height,
            lineHeight: "17px"
        };
        if(!data || !data.get("data")){
            return <div>"loading"</div>;
        }


        showField = showField || "segment";

        let words = data.get("data").toJSON();

        let wordStyle = {width: 100};

        let barStyle = {
            height: 17,
            position: "absolute",
            top: 1,
            left: 0,
            backgroundColor: PRIMARY_VERY_LIGHT,
            zIndex: -1
        };

        let scale = d3.scale.linear()
            .range([1,wordStyle.width-5])
            .domain([1, context.max]);

        let scaleColor = d3.scale.linear()
            .range(["#aaa","#FF0004"])
            .domain(d3.extent(words, (word) => word.score));
        let maxScore = d3.max(words, (word) => word.score);
        let showData = maxScore ? data.get("data").sortBy(w => w.get("score")).reverse() : data.get("data");

        //showData.forEach(a => console.log(a.get("key")));
        
        if(sortBy == "Count") {
            showData = showData.sort((a,b) => b.get(showField) - a.get(showField))
        } else if (sortBy == "Proportion") {
            showData = showData.sort((a,b) => b.get("score") - a.get("score"))
        } else if (sortBy == "Alphabetically") {
            showData = showData.sort((a,b) => d3.ascending(a.get("key"), b.get("key")))
        }
        
        return <div style={containerStyle}>
            {showData.map(w => {
                return <Word key={w.get("key")}
                             segmentCount={segmentCount}
                             width={wordStyle.width}
                             height="17"
                             segment={segment}
                             color={scaleColor(w.get("score"))}
                             word={w.get("key")}
                             highlight={w.get("key") == highlight}
                             barWidth={scale(w.get(showField))}
                             exclusive={this.isExclusive(w.get("key"))}
                             onContextMenu={(e) => { e.preventDefault(); this.props.remove(w.get("key"))}}
                             onSelect={() => this.props.onSelect(w.get("key"))}
                             onMouseEnter={() => this.props.onOver(w.get("key"))}
                             onMouseLeave={this.props.onOut} />
            })}
        </div>
    }

    render_Spatial() {
        let {width, height} = this.props;
        if(!this.state.layout) {
            return <div>Loading...</div>
        }
        let {layout} = this.state;
        return (
            <svg {...this.props}>
                <g transform={"translate(" +  width/2 + "," + height/2 + ")"}>
                    {layout.map((w, i) => {
                        let style = {
                            fontSize: w.size
                        };
                        return <text key={i} style={style}
                                      transform={"translate(" + [w.x, w.y] + ")rotate(" + w.rotate + ")"}
                                      textAnchor="middle">{w.text}</text>
                    })}
                </g>
            </svg>
        );
    }
}

export default WordCloud;

























