/**
 * Created by cristianfelix on 1/4/16.
 */
import React from 'react';

class Caption extends React.Component {
    getStyle() {
        return {
            marginTop: 0,
            color: "#444"
        }
    }

    render() {
        return (
            <div style={this.getStyle()}>
                <b>{this.props.children}</b>
            </div>
        );
    }
}

Caption.propTypes = {};
Caption.defaultProps = {};

export default Caption;
