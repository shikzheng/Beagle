/**
 * Created by cristianfelix on 12/31/15.
 */
import React from 'react';

class ClearBox extends React.Component{
    render() {
        let style = {
            left: 0,
            right: 0,
            textAlign: "center",
            top: 0,
            bottom: 0,
            fontSize: 100,
            position: "absolute",
            color: this.props.color || "#ccc"
        };
        let spanStyle = {
            position: "absolute",
            left: 0,
            right: 0,
            top: "30%"
        };

        return (
            <div style={style}>
                <span style={spanStyle} ></span>
            </div>
        );
    }
}

ClearBox.propTypes = {};
ClearBox.defaultProps = {};

export default ClearBox;
