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
		this.loadData();
	}

	translateStateToFilter(state) {
    console.log(state);
    console.log(state.filters);
    var jsonQuery = {
      filters: []
    }
    state.filters.forEach(function(element,index,array) {
      var jsonData ={};
      var selection;
      console.log(element.selection);

      //var selection = this.translateSelection(element.selection);
      if (element.selection == 'SUBJECT CONTAINS:') {
        selection = 'Subject';
      } else if (element.selection == 'MENTION:') {
        selection = 'Contents';
      } else {
        selection = 'ToAddresses';
      }

      jsonData['field'] = selection;
      jsonData['operation'] = 'in';
      jsonData['value'] = element.values;
      jsonQuery.filters.push(jsonData);
    });
    console.log(jsonQuery);
    return jsonQuery;
  }

	loadData() {
		let {field} = this.props;
		this.state.field = field;
		let query = `query getData($filters:[Rule]){
			Select(filters:$filters) {
				Summaries{
					${field} {
						Key
						Count
					}
				}
			}
		}`

		dataSource.query(
			query, this.translateStateToFilter(this.props.state)
		).then(
			r => this.setState({words: r.data.Select.Summaries[field]})).catch(console.error);

	}


	render() {
		const {actions} = this.props;
		console.log("Charizard")
		console.log(this.state.field);
		console.log(this.state.words);

		return <WordCloud actions = {actions} words = {this.state.words} field = {this.state.field}/>;
	}
}

WordCloudContainer.propTypes = {
	actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
	const props = {state};
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
