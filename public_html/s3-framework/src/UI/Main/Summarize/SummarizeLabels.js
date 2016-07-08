/**
 * Created by cristianfelix on 1/4/16.
 */
import React from 'react';
import SummaryLabel from './SummaryLabel';
class SummarizeLabels extends React.Component {
    render() {
        let {summaries} = this.props;
        return (
            <div>
                {summaries.map((summary, i) =>
                    <SummaryLabel summary={summary} key={i} />)
                }
            </div>
        );
    }
}

SummarizeLabels.propTypes = {};
SummarizeLabels.defaultProps = {};

export default SummarizeLabels;
