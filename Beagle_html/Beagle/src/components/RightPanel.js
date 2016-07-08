'use strict';

import React from 'react';
import Panel from './Panel'
import WordCloudContainer from '../containers/WordCloudContainer';
require('styles//RightPanel.scss');
class RightPanel extends React.Component {
  render() {
    return (
      <div className="rightpanel-component">
        <Panel title="Mentions" height="50%">
            <WordCloudContainer field="PERSON" />
            <WordCloudContainer field="Subject" />
        </Panel>
      </div>
    );
  }
}

RightPanel.displayName = 'RightPanel';

// Uncomment properties you need
// RightPanel.propTypes = {};
// RightPanel.defaultProps = {};

export default RightPanel;
