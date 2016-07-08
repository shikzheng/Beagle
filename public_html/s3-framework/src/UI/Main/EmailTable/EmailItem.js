/**
 * Created by cristianfelix on 1/4/16.
 */
import React from 'react';
import d3 from 'd3';
import { DragSource, DropTarget } from 'react-dnd';
import { ItemTypes } from '../../../definitions';


export default class EmailItem extends React.Component {
    render() {
        let tableStyle = {
          width: "100%",
          paddingTop: 10,
          paddingBottom: 1,
          paddingLeft: 5,
          borderTop: "solid 1px #ccc" }
        let {data} = this.props;
      
        //let scale = d3.scale.linear().domain([0, stats.max[showField]]).range([0,100])
        let selectedStyle = {
            backgroundColor: "#55C94B"
        };
        let style = {width: 3, paddingBottom: 10};


        return (
            <tr onDoubleClick={() => split(data)}>
                <td style={style}></td>
                <td style={tableStyle}>
                        <div style={{ fontSize: 14}}>
                            {data}
                        </div>
                        <div style={{height: 8}}></div>
                </td>
                <td style={{}}></td>
            </tr>
        );
    }
}
