/**
 * Created by cristianfelix on 12/31/15.
 */
import React from 'react';
import Container from '../../Common/Container';
import Surrogate from '../../Common/Surrogate';
import Caption from './Caption'
export default class SelectSamples extends React.Component {
    getStyle() {
        return {
            overflow: "auto",
            marginTop: 10

        }
    }
    render() {
        let {data} = this.props;
        return (
            <Container>
                <Container style={this.getStyle()}>
                    {data.map((doc, i) => <Surrogate key={doc.get("_id")} data={doc} />)}
                </Container>
            </Container>
        );
    }
}