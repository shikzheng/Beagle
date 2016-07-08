/**
 * Created by cristianfelix on 2/7/16.
 */
import React from 'react';
import {PRIMARY} from './../../Summaries/style'
class ToolTip extends React.Component {
  render() {
      let {x, y, selected, selectedKeys, segmentInfo} = this.props;
      let style = {
          position: "fixed",
          backgroundColor: "white",
          color: "#000",
          boxShadow: "0px 0px 5px #ccc",
          fontSize: 12,
          padding: 5,
          zIndex: 999999,
          left: window.cursorX + 10,
          top: window.cursorY + 10,
          transition: "all 0.5s"
      };

      
      
      let countScale = d3.scale.linear().range([0,50]).domain([0, d3.max(selectedKeys.toJSON(), k => k.segment)]);
      let propScale = d3.scale.linear().range([0,50]).domain([0, d3.max(selectedKeys.toJSON(), k => k.proportion || k.score)]);
      return (
          <div style={style}>
              <div style={{fontSize: 16, fontWeight: "bold"}}>{selected}</div>
              <table>
                  <tbody>
                  {selectedKeys ? selectedKeys.map(s => (<tr key={s.get("segmentKey")}>
                            <td colspan="2">
                                <div style={{fontWeight: "bold"}}>{s.get("segmentKey") == "_all" ? "" : s.get("segmentKey")}</div>
                            </td>
                            <td style={{whiteSpace: "no-wrap"}}>
                                <div style={{height: 10, width: countScale(s.get("segment")), backgroundColor: PRIMARY}}></div>{s.get("segment")}
                            </td>
                            {s.get("proportion") > 0 || s.get("score") ? <td>
                                <div style={{height: 10, width: propScale(s.get("proportion") || s.get("score")), backgroundColor: "#A9E2A4"}}></div>
                                {s.get("proportion") ? (s.get("proportion")*100).toFixed(2) + "%" : (s.get("score")*100).toFixed(2)}
                            </td> : undefined }
                  </tr>)) : undefined}
                  </tbody>
              </table>
          </div>
      );
  }
}

ToolTip.propTypes = {};
ToolTip.defaultProps = {};

export default ToolTip;
