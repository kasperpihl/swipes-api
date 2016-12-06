import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions';
import PureRenderMixin from 'react-addons-pure-render-mixin';

class HOCGoalStep extends Component {
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
HOCGoalStep.propTypes = {
  // removeThis: PropTypes.string.isRequired
};

const ConnectedHOCGoalStep = connect(mapStateToProps, {
  onDoing: actions.doStuff,
})(HOCGoalStep);
export default ConnectedHOCGoalStep;
