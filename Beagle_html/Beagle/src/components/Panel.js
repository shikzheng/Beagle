'use strict';

import React from 'react';

require('styles//Panel.scss');

class Panel extends React.Component {
	render() {
		let {title, direction,height} = this.props;
		console.log("height: " + height);
		let styles = {
			content: {
				flexDirection: direction,
				height: height
			}
		}
		return (
			<div className="panel-component">
				<h1>{title}</h1>
				<div className="panel-component-content"  style={styles.content}>
					{this.props.children}
				</div>
			</div>
		);
	}
}

Panel.displayName = 'Panel';

// Uncomment properties you need
// Panel.propTypes = {};
// Panel.defaultProps = {};

export default Panel;
