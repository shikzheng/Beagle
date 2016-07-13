import React, {
  Component,
  PropTypes
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
//import FilterItem from '../components/FilterItem';
import FilterPanel from '../components/FilterPanel';
import { addFilter } from '../actions/const';

class FilterContainer extends Component {
  constructor() {
    super();
  }



  render() {
  let {actions,filters} = this.props;
  console.log(filters);
  console.log(actions.addFilter);
  return (<FilterPanel action={actions.addFilter} filters={filters}/>)
  }
}

FilterContainer.propTypes = {
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const props = {filters: state.filters};
  return props;
}

function mapDispatchToProps(dispatch) {
  const actions = {addFilter};
  const actionMap = {actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterContainer);
