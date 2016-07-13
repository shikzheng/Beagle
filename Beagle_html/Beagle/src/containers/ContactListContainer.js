import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ContactList from '../components/ContactList';
import dataSource from '../sources/dataSource';

class ContactListContainer extends Component {
	constructor() {
		super();
		this.state = {
			contacts: []
		};
	}
	shouldLoadData() {

	}

	componentWillMount() {
		this.loadData();
	}

	componentWillReceiveProps(nextProps) {

	}

	loadData() {
		dataSource.query(`
			{
				Select{
					Summaries {
						To {
							Key
							Count
						}
					}
				}
			}
		`).then(r => this.setState({contacts: r.data.Select.Summaries.To})).catch(console.error)
	}

	render() {
		console.log(this.state);
		const {actions} = this.props;
		return <ContactList actions={actions} contacts={this.state.contacts} />;
	}
}

ContactListContainer.propTypes = {
	actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
	const props = {};
	return props;
}

function mapDispatchToProps(dispatch) {
	const actions = {};
	const actionMap = { actions: bindActionCreators(actions, dispatch) };
	return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactListContainer);
