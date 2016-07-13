'use strict';

import React from 'react';
import Panel from './Panel'
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {addFilter} from '../actions/const';
import FilterItem from '../components/FilterItem'

require('styles//FilterPanel.scss');
class FilterPanel extends React.Component {

  render() {
    let {action,filters} = this.props;
    console.log("Filters: ");
    console.log(filters);
    let style ={
      position:"absolute",
      marginLeft: 200,
      marginTop: -22,
    };

    let styleItem = {
     marginTop:10
   }
    let size = filters.length;


    return (
      <div className="filterpanel-component">
        <Panel title="Filters">
          <FloatingActionButton style={style} mini={true} onClick={()=>action()}>
            <ContentAdd />
          </FloatingActionButton>
          <div>
          <TextField
            fullWidth={true}
            id="Search"
            hintText=""
            type="search"
            floatingLabelText={(<div>
              <SearchIcon color="#ccc" style={{ verticalAlign: 'middle', transform:'scale(0.8) translate(0px,-2px)'}}/>
              <span style={{display: 'inline-block'}}>Search</span>
            </div>)}/>
          </div>

          <div style={styleItem}>
          {filters.map((s, idx) =><FilterItem idx={idx} size={size}/>)}
          </div>



        </Panel>
      </div>
    );
  }
}

FilterPanel.displayName = 'FilterPanel';

// Uncomment properties you need
// FilterPanel.propTypes = {};
// FilterPanel.defaultProps = {};

export default FilterPanel;
//<SearchIcon style={{postion: 'absolute', color:'#ccc'}}/>
