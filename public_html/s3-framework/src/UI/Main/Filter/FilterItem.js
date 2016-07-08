import React from 'react';
var DropDown = require('./DropDown.js');

module.exports = React.createClass({
    render: function() {
      let {idx, size} = this.props;
      let lineStyle;

      let svgStyle = {
        display: "inline-block",
        verticalAlign: "top",
        paddingBottom: 0,
        position: "absolute",
        height:"100%"
      }

      let unorderedList = {
        display: "inline-block",
        width: 220,
        marginLeft: 20
      }

      console.log("size~~:" + size);
      if (size != idx+1) {
         lineStyle = {
          borderLeft: "solid 3px #ccc",
          width: 30,
          height:"100%",
          marginTop:-8,
          marginLeft:8.4,
          
        }
      } else {
        lineStyle = {}
      }

      let wut = {
            overflow: "hidden",
            position: "relative"
      }


      console.log(this.props);



      return(

        <div style={wut} >
              <span style = {svgStyle} width={30}>
              <svg width = {30} height = {20}>
                <circle cx={10} cy={10} r={6} stroke="blue" strokeWidth={1} fill="blue" />
                </svg>
                <div style = {lineStyle}></div>
                </span>



            <span style={unorderedList}>
              <tr>
                <td>
                  <DropDown
                    options={['IS FROM/TO:', 'MENTION:', 'SUBJECT CONTAINS:']}
                    active={null}
                    onChange={null}
                    size={size}
                    />
                </td>
              </tr>
            </span>
        </div>

      );
    }



});
