/* eslint-env node, mocha */
/* global expect */
/* eslint no-console: 0 */
'use strict';

// Uncomment the following lines to use the react test utilities
// import TestUtils from 'react-addons-test-utils';
import createComponent from 'helpers/shallowRenderHelper';

import DocumentList from 'components//DocumentList.js';

describe('DocumentList', () => {
  let component;

  beforeEach(() => {
    component = createComponent(DocumentList);
  });

  it('should have its component name as default className', () => {
    expect(component.props.className).to.equal('documentlist-component');
  });
});
