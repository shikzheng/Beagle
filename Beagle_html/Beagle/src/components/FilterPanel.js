'use strict';

import React from 'react';
import Panel from './Panel'
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';

require('styles//FilterPanel.scss');
class FilterPanel extends React.Component {
  render() {
    return (
      <div className="filterpanel-component">
      
        <Panel title="Filters">
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