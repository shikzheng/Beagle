import React, {
	Component,
	PropTypes
} from 'react';
import {	bindActionCreators} from 'redux';
import {	connect} from 'react-redux';
import WordCloud from '../components/WordCloud';
import dataSource from '../sources/dataSource';
require('styles//wordcloud-component-words.scss');
class WordCloudContainer extends Component {
	constructor() {
		super();
		this.state = {
			words: [],
			field: ""
		}
	}
	shouldLoadData(props, state) {

	}

	componentWillMount() {
		this.loadData();
	}

	componentWillReceiveProps(nextProps) {
		if(this.shouldLoadData()) {
			this.loadData();
		}
	}

	loadData() {
		let {field} = this.props;
		this.state.field = field;
		dataSource.query(`
			{
				Select {
					Summaries{
					${field} {
						Key
						Count
					}
					}
				}
				}
		`).then(
			r => this.setState({words: r.data.Select.Summaries[field]})).catch(console.error);

	}


	render() {
		const {actions} = this.props;
		return <WordCloud actions = {actions} words = {this.state.words} field = {this.state.field}/>;
	}
}

WordCloudContainer.propTypes = {
	actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
	const props = {};
	return props;
}

function mapDispatchToProps(dispatch) {
	const actions = {};
	const actionMap = {
		actions: bindActionCreators(actions, dispatch)
	};
	return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(WordCloudContainer);
