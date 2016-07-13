import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Emails from '../components/Emails';
import dataSource from '../sources/dataSource';

class EmailsContainer extends Component {
  constructor() {
    super();
    this.state = {
      emails: []
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
    `).then(r => this.setState({emails: r.data.Select.Summaries.To})).catch(console.error)
  }

  render() {
    const {actions} = this.props;
    return <Emails actions={actions} emails={this.state.emails} />;
  }
}

function mapStateToProps(state) {
	const props = {};
	return props;
}

function mapDispatchToProps(dispatch) {
	const actions = {};
	const actionMap = { actions: bindActionCreators(actions, dispatch) };
	return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(EmailsContainer);
