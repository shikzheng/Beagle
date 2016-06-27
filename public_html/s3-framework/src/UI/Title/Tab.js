/**
 * Created by cristianfelix on 12/30/15.
 */
import React from 'react';

class Tab extends React.Component {
    constructor() {
        super();
        this.state = {
            hover: false
        };
    }

    MouseOver() {
        this.setState({ hover: true })
    }

    MouseOut() {
        this.setState({ hover: false })
    }

    getStyle() {
        return {
            float: "left",
            padding: 10,
            height: this.props.height ? this.props.height - 15: 0,
            paddingTop: 5,
            fontSize: 15,
            cursor: "default",
            backgroundColor: this.props.selected  ? "#2B759B" : (this.state.hover ? "#09587A" : undefined)
        }
    }

    render() {
        return (
            <li style={this.getStyle()} onClick={this.props.onClick}
                onMouseOver={this.MouseOver.bind(this)}
                onMouseOut={this.MouseOut.bind(this)}
            >
                {this.props.children}
            </li>
        );
    }
}

Tab.propTypes = {};
Tab.defaultProps = {};

export default Tab;
