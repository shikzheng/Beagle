/**
 * Created by cristianfelix on 12/31/15.
 */
import React from 'react';
import Container from '../../Common/Container'
import Caption from './Caption'
class SelectStats extends React.Component {
    render() {
        let {data, style} = this.props;
        let localStyle = Object.assign({}, { fontSize: 14, color: "#999", margin: 5}, style)
        return (
            <Container>
                <div style={localStyle}> <b>{JSON.stringify(data)}</b> Documents </div>
            </Container>
        );
    }
}

export default SelectStats;
