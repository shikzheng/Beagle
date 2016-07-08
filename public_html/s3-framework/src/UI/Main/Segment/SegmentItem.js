/**
 * Created by cristianfelix on 1/4/16.
 */
import React from 'react';
import d3 from 'd3';
import { DragSource, DropTarget } from 'react-dnd';
import { ItemTypes } from '../../../definitions';

const segmentSource = {
    beginDrag(props) {
        return props.data.toJSON();
    }
};

const segmentItemTarget = {
    drop(props,monitor, obj) {
        const item = monitor.getItem();
        if(monitor.getItemType() == ItemTypes.SEGMENT){
            props.merge(item, props.data.toJSON());
        }
        return { name: 'Merge' };
    }
};

@DragSource(ItemTypes.SEGMENT, segmentSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
}))
@DropTarget(ItemTypes.SEGMENT, segmentItemTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    item: monitor.getItemType(),
    canDrop: monitor.canDrop()
}))
export default class SegmentItem extends React.Component {
    render() {
        let {stats, data, isDragging, connectDragSource, connectDropTarget, type, isOver, split, isMerge, showField} = this.props;
        let scale = d3.scale.linear().domain([0, stats.max[showField]]).range([0,100])
        let selectedStyle = {
            backgroundColor: "#55C94B"
        };
        let style = {width: 3, paddingBottom: 10, backgroundColor: isOver ? "red": (isMerge ? "#ccc" : "white")};
        if(this.props.selected) {
            Object.assign(style, selectedStyle);
        }

        return (
            <tr onDoubleClick={() => split(data)}>
                <td style={style}></td>
                <td style={{borderLeft: "solid 0px #ccc"}}>
                    {connectDropTarget(connectDragSource(<div style={{backgroundColor: isDragging ? "#cfd" : "white"}}>
                        <div style={{ fontSize: 11}}>
                            {data.get("key_as_string")|| data.get("key")} - {data.get(showField)}
                        </div>
                        <div style={{ width: scale(data.get(showField)) + "%", height: 8, backgroundColor: "#878A99"}}></div>
                        <div style={{ width: scale(data.get(showField)) + "%", height: 8}} title={data.get(showField)}></div>
                    </div>))}
                </td>
                <td style={{}}></td>
            </tr>
        );
    }
}
