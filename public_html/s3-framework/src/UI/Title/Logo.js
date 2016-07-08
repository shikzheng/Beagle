/**
 * Created by cristianfelix on 12/30/15.
 */
import React from 'react';
import Container from '../Common/Container'

class Logo extends React.Component {
    getStyle() {
        return {
            margin: 0,
            height: 30,
            display: "inline-block",
            width: this.props.width,
            position: "absolute",
            marginRight: 10
        }
    }

    render() {
        return (
            <Container style={this.getStyle()}>
                <h1 style={{margin: 0, height: 60, padding: 5, fontSize: 20}}>
                    <b></b>
                    <span style={{fontWeight: "normal"}}>TextTile</span>
                </h1>
            </Container>
        );
    }
}

Logo.propTypes = {};
Logo.defaultProps = {};

export default Logo;
