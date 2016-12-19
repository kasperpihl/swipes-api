import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { map } from 'react-immutable-proptypes';
import { setupDelegate } from 'classes/utils';
import GoalOverview from './GoalOverview';


class HOCGoalOverview extends Component {
  static contextButtons() {
    return [{
      component: 'Button',
      props: {
        icon: 'ListIcon',
      },
    }, {
      component: 'Button',
      props: {
        icon: 'ThreeDotsIcon',
      },
    }];
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = setupDelegate(props.delegate);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
  }
  onContextClick(i) {
    const {
      toggleSideNote,
      goalId,
      goalDelete,
    } = this.props;
    if (i === 0) {
      toggleSideNote(goalId);
    } else {
      goalDelete(goalId);
    }
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

const { string, func, object } = PropTypes;
HOCGoalOverview.propTypes = {
  goal: map,
  goalId: string,
  delegate: object,
  navPush: func,
  goalDelete: func,
  toggleSideNote: func,
};

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
  };
}

export default connect(mapStateToProps, {
  navPush: actions.navigation.push,
  goalDelete: actions.goals.deleteGoal,
  toggleSideNote: actions.main.toggleSideNote,
})(HOCGoalOverview);
