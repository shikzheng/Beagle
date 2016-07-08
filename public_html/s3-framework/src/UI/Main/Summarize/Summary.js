/**
 * Created by cristianfelix on 1/4/16.
 */
import React from 'react';
import BarChart from '../../Summaries/BarChart'
import WordCloud from '../../Summaries/WordCloud'
import LineChart from '../../Summaries/LineChart'
import WorldMap from '../../Summaries/WorldMap'
import WorldMap2 from '../../Summaries/WorldMap 2'
import {isDiff} from '../../Common/utils'
class Summary extends React.Component {
    renderBarChart(props = this.props) {
        let {type} = this.props;
        switch (type) {
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
            default:
                return (<div {...props}>Not Implemented</div>)
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        let checkProps = ["height", "width", "segment", "summary", "highlight", "type", "showField", "data", "context"]
        return isDiff(this.props, nextProps);
    }

    render() {

        let {summary, height, width} = this.props;
        let containerProps = {
            style: {
                width: width,
                height: height
            }
        };

        return <div {...containerProps}>{this.renderBarChart(this.props)}</div>
    }
}

Summary.propTypes = {};
Summary.defaultProps = {};

export default Summary;
