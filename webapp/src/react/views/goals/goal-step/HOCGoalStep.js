import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map, mapContains, list, listOf } from 'react-immutable-proptypes';
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
    const { goal } = this.props;
    return (
      <GoalStep goal={goal} delegate={this} />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
  };
}

const { string } = PropTypes;
HOCGoalStep.propTypes = {
  // removeThis: PropTypes.string.isRequired
};

const ConnectedHOCGoalStep = connect(mapStateToProps, {
  navPop: actions.navigation.pop,
})(HOCGoalStep);
export default ConnectedHOCGoalStep;
