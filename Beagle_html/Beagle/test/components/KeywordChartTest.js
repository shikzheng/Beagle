/* eslint-env node, mocha */
/* global expect */
/* eslint no-console: 0 */
'use strict';

// Uncomment the following lines to use the react test utilities
// import TestUtils from 'react-addons-test-utils';
import createComponent from 'helpers/shallowRenderHelper';

import KeywordChart from 'components//KeywordChart.js';

describe('KeywordChart', () => {
  let component;

  beforeEach(() => {
    component = createComponent(KeywordChart);
  });

  it('should have its component name as default className', () => {
    expect(component.props.className).to.equal('keywordchart-component');
  });
});
