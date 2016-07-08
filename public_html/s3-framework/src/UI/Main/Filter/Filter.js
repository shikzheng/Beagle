import React from 'react';
var lodashMap = require('lodash.map');
import _ from 'lodash';
var FilterItem = require('./FilterItem.js');
module.exports = React.createClass({

  getInitialState: function() {
        return {
        };
      },

      render() {


        //console.log("Filter: ");
        //console.log(this.props);
        let {data} = this.props;
        //console.log("This")
        //console.log(data.toJSON())
        let array = data._root.entries[0][1]._root.entries[1][1];
        let size = array.size;
        array.map((s, idx) => {console.log("Idx: " + idx)});

        let style = {
          marginTop:10
        }
        return (
          <div style={style}>{
          array.map((s, idx) =><FilterItem idx={idx} size={size}/>)
        }
          </div>
      )


      }

});
