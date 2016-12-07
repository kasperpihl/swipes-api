import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { map } from 'react-immutable-proptypes';
import GoalOverview from './GoalOverview';


class HOCGoalOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
  }
  goalOverviewClickedStep(goalOverview, stepIndex) {
    const {
      navPush,
      goalId,
      goal,
    } = this.props;
    navPush({
      component: 'GoalStep',
      title: `${stepIndex + 1}. ${goal.getIn(['steps', stepIndex, 'title'])}`,
      props: {
        goalId,
        stepIndex,
      },
    });
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
const { string, func } = PropTypes;
HOCGoalOverview.propTypes = {
  goal: map,
  goalId: string,
  navPush: func,
};

const ConnectedHOCGoalOverview = connect(mapStateToProps, {
  navPush: actions.navigation.push,
})(HOCGoalOverview);
export default ConnectedHOCGoalOverview;
