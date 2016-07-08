'use strict';

import React from 'react';

require('styles//WordCloud.sass');

class WordCloud extends React.Component {
  render() {
  let {words} = this.props;
    return (
      <div className="wordcloud-component">
        Please edit src/components///WordCloudComponent.js to update this component!
      </div>
    );
  }
}

WordCloud.displayName = 'WordCloud';

// Uncomment properties you need
// WordCloudComponent.propTypes = {};
// WordCloudComponent.defaultProps = {};

export default WordCloud;
