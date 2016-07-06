import React from 'react';
var FilterItem = require('./FilterItem.js');


module.exports = React.createClass({
    getInitialState: function() {
      return {
        a: 1
      };
    },

    render: function() {
      console.log("Filter: ");
      console.log(this.props);
      return(
        <div>
          <FilterItem />
        </div>
      );
    }



});
