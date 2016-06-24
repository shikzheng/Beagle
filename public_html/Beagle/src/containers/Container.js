/**
 * Created by cristianfelix on 12/30/15.
 */
import React from 'react';

class Container extends React.Component {
  render() {
    return (
      <div {...this.props}>
          {this.props.children}
      </div>
    );
  }
}

Container.propTypes = {};
Container.defaultProps = {};

export default Container;
