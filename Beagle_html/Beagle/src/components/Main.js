require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import FilterPanel from './FilterPanel';
import CenterPanel from './CenterPanel';
import RightPanel from './RightPanel';
import ProgressBar from './ProgressBar'
class AppComponent extends React.Component {
	render() {
		return (
			<div className="index">
				<ProgressBar />
				<FilterPanel />
				<CenterPanel />
				<RightPanel />
			</div>
		);
	}
}

AppComponent.defaultProps = {
};

export default AppComponent;
