/**
 * Created by cristianfelix on 12/30/15.
 */
import React, { PropTypes } from 'react';
import Container from '../Common/Container';
import { DragSource } from 'react-dnd';
import { ItemTypes } from '../../definitions';


const fieldSource = {
    beginDrag(props) {
        return props.data;
    }
};

@DragSource(ItemTypes.FIELD, fieldSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
class Field extends React.Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired
    };
    getStyle() {
        return {
            float: "left",
            padding: 2,
            paddingLeft: 10,
            paddingRight: 10,
            margin: 2,
            fontSize: 12,
            width: "100%",
            whiteSpace: "no-wrap",
            cursor: "default",
            userSelect: "none"
        }
    }
    getIcon(type) {
        const { isDragging, connectDragSource, text } = this.props;
        let iconClass = "";
        let styleIcon = { color: isDragging ? "white" : "#555"};
        switch (type) {
            case "TEXT":
                iconClass = "fa-file-text-o";
                break;
            case "CATEGORICAL":
                iconClass = "fa-bars";
                break;
            case "DATE":
                iconClass = "fa-calendar";
                break;
            case "CONTINUOUS":
            case "QUANTITATIVE":
                return <i style={styleIcon}>#</i>
            case "BOOLEAN":
                iconClass = "fa-check-circle-o";
                break;
            case "GEO_US_ZIP": 
            case "GEO_COUNTRY_NAMES":
                iconClass = "fa-globe";
                break;


        }
        return <i style={styleIcon} className={"fa " + iconClass}></i>
    }
    render() {
        const { isDragging, connectDragSource, text } = this.props;
        let style = this.getStyle();
        if(isDragging) {
            style.backgroundColor = "#074563";
            style.color = "white";
        }
        let desc = this.props.data.key;
        if(desc.indexOf("$nlp") > -1) {
            let parts = desc.split(".");
            desc = parts.splice(2,2).join(".")
        }
        return connectDragSource(
            <div style={style}>{this.getIcon(this.props.data.type_desc)} {desc}</div>
        );
    }
}

Field.propTypes = {};
Field.defaultProps = {};

export default Field;
