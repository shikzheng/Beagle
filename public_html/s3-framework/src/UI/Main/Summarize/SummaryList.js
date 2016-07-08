/**
 * Created by cristianfelix on 1/4/16.
 */
import React from 'react';
import Container from '../../Common/Container'
import Summary from './Summary'

export default class SummaryList extends React.Component {
    getStyle() {
        return {
            display: "inline-block",
            width: 300,
        }
    }
    render() {
        let {segment, summaries} = this.props;
        return (
            <Container style={this.getStyle()}>
                <div style={{ margin: 5, color: "#074563", fontSize: 20, borderBottom: "solid 0px #ccc"}}>
                    {segment.get("key")}
                </div>
                {summaries.map((summary, i) => <Summary key={i} summary={summary} />)}
            </Container>
        );
    }
}