import React from 'react';
var DropDown = require('./DropDown.js');

module.exports = React.createClass({
    render: function() {
      let svgStyle = {
        display: "inline-block",
        verticalAlign: "top",
        paddingBottom: 0
      }

      let unorderedList = {
        display: "inline-block",
        width: 220
      }


      console.log(this.props);


      return(
        <div>
        <div>
            <span style={svgStyle}>
              <svg width={20} height={100}>
                <circle cx={10} cy={10} r={6} stroke="blue" strokeWidth={1} fill="blue" />
                <line x1={10} y1={16} x2={10} y2={100} stroke="gray" strokeWidth={3 } />
              </svg>
            </span>
            <span style={unorderedList}>
              <tr>
                <td>
                  <DropDown
                    options={['IS FROM/TO:', 'MENTION:', 'SUBJECT CONTAINS:']}
                    active={null}
                    onChange={null} />
                </td>
              </tr>
            </span>
        </div>
        <div>
            <span style={svgStyle}>
              <svg width={20} height={100}>
                <circle cx={10} cy={10} r={6} stroke="blue" strokeWidth={1} fill="blue" />
                <line x1={10} y1={16} x2={10} y2={100} stroke="gray" strokeWidth={3 } />
              </svg>
            </span>
            <span style={unorderedList}>
              <tr>
                <td>
                  <DropDown
                    options={['IS FROM/TO:', 'MENTION:', 'SUBJECT CONTAINS:']}
                    active={null}
                    onChange={null} />
                </td>
              </tr>
            </span>
        </div>
        </div>
      );
    }



});
