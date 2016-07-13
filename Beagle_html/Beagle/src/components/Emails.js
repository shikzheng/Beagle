'use strict';

import React from 'react';
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';

require('styles//Emails.scss');

class Emails extends React.Component {
	render() {
    console.log(this.props);
		let {emails} = this.props;
		return (
			<div className="Emails-component">
				<div className="Emails-component-list" style={{ marginTop: -30 }}>
					{emails.map(c => <div key={c.Key} className="Emails-component-info">{c.Key}</div>)}
				</div>
      </div>
		);
	}
}

Emails.displayName = 'Emails';



export default Emails;
