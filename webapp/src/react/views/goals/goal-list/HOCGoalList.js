import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import PureRenderMixin from 'react-addons-pure-render-mixin';

class HOCGoalList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="className" />
    );
  }
}

function mapStateToProps(state) {
  return {
    main: state.get('main'),
  };
}

import { map, mapContains, list, listOf } from 'react-immutable-proptypes';
const { string } = PropTypes;
HOCGoalList.propTypes = {
  // removeThis: PropTypes.string.isRequired
};

const ConnectedHOCGoalList = connect(mapStateToProps, {
  onDoing: actions.doStuff,
})(HOCGoalList);
export default ConnectedHOCGoalList;
