/**
 * Created by cristianfelix on 1/4/16.
 */
import React from 'react';

class SummaryLabel extends React.Component {
    getStyle() {
        return {
            transform: "rotate(-90deg) translate(10,20)",
            width: 20,
            height: 10,
            textAlign: "center"
        }
    }
  render() {
    return (
      <div style={this.getStyle()}>SummaryLabel</div>
    );
  }
}

SummaryLabel.propTypes = {};
SummaryLabel.defaultProps = {};

export default SummaryLabel;
