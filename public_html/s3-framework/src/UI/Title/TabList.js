/**
 * Created by cristianfelix on 12/30/15.
 */
import React from 'react';

class TabList extends React.Component {
    getStyle() {
        return {
            margin: 0,
            padding: 0,
            left: this.props.left,
            position: "absolute",
            height: this.props.height,
            listStyle: "none"
        }
    }

    render() {
        return (
            <ul style={this.getStyle()}>
                {this.props.children}
            </ul>
        );
    }
}

TabList.propTypes = {};
TabList.defaultProps = {};

export default TabList;
