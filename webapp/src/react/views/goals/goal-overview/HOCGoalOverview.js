import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { map, mapContains, list, listOf } from 'react-immutable-proptypes';
import GoalOverview from './GoalOverview';


class HOCGoalOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
  }
  goalOverviewClickedStep(goalOverview, stepId) {
    console.log(stepId);
  }
  render() {
    const { goal } = this.props;
    return (
      <GoalOverview goal={goal} delegate={this} />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
  };
}

HOCGoalOverview.propTypes = {
  goal: map,
};

const ConnectedHOCGoalOverview = connect(mapStateToProps, {
  onDoing: actions.doStuff,
})(HOCGoalOverview);
export default ConnectedHOCGoalOverview;
