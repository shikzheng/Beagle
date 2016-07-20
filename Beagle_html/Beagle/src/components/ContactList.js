'use strict';

import React from 'react';
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';

require('styles//ContactList.scss');

class ContactList extends React.Component {
	render() {
		let {contacts} = this.props;


		return (
			<div className="contactlist-component">
				<div>
					<TextField
						style={{ transform: 'scale(0.8) translate(-10%,-30px)', width: '120%' }}
						fullWidth={true}
						id="Search"
						hintText=""
						type="search"
						floatingLabelText={(<div>
							<SearchIcon color="#ccc" style={{ verticalAlign: 'middle', transform: 'scale(0.8) translate(0px,-2px)' }}/>
							<span style={{ display: 'inline-block' }}>Search</span>
						</div>) }/>
				</div>
				<div className="contactlist-component-list" style={{ marginTop: -30 }}>
					{contacts.map(c => <div key={c.Key} className="contactlist-component-contact">{c.Key}</div>)}
				</div>
			</div>
		);
	}
}

ContactList.displayName = 'ContactList';

// Uncomment properties you need
// ContactList.propTypes = {};
// ContactList.defaultProps = {};

export default ContactList;
