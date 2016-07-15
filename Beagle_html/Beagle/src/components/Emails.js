'use strict';

import React from 'react';
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';
import _ from 'lodash';

require('styles//Emails.scss');

let monthEnum = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


class Emails extends React.Component {
	render() {
		let {emails} = this.props;
		let fullDates = [];
		for (var i = 0; i < emails.length; i++) {
			let str = i + ".Timestamp"
			let time = new Date(parseInt(_.get(emails, str)));
			let month = time.getMonth().toString();
			let day = time.getDate().toString();
			let year = time.getFullYear().toString();
			let date = monthEnum[month] + ' ' + day + ', ' +  year + ' ';
			fullDates.push(date);
		}

		return (
			<div className="Emails-component">
				<div className="Emails-component-list" style={{ marginTop: -30 }}>
					{emails.map((c,idx) => <div key={c.Subject} className="Emails-component-info">{fullDates[idx] + c.Subject}</div>)}
				</div>
      </div>
		);
	}
}

Emails.displayName = 'Emails';



export default Emails;
