import React from 'react';

class ConfigWindow extends React.Component {
    render() {
        let {x ,y, show, onMouseOut} = this.props;
        console.log("ConfigWindow.js",6);
        let style = {
            position: "fixed",
            display: show ? "block" : "none",
            left: x,
            top: y,
            backgroundColor: "rgba(255,255,255,0.95)",
            boxShadow: "10px 10px 10px #ccc",
            border: "solid 2px #ccf"
        };

        return (
            <div style={style} onMouseLeave={onMouseOut}>
                {this.props.children}
            </div>
        )
    }
}

ConfigWindow.propTypes = {};
ConfigWindow.defaultProps = {};

export default ConfigWindow;
