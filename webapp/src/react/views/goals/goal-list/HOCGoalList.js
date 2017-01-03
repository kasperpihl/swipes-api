import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from 'actions';
import { setupDelegate } from 'classes/utils';
import GoalList from './GoalList';


class HOCGoalList extends Component {
  static contextButtons() {
    return [{
      component: 'Button',
      props: {
        text: 'Create Goal',
        primary: true,
      },
    }];
  }

  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.delegate);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
  }
  onContextClick() {
    const { navPush } = this.props;
    navPush({
      component: 'StartGoal',
      title: 'Create',
    });
  }
  goalListClickedGoal(goalList, goalId) {
    const {
      navPush,
      goals,
    } = this.props;
    const goal = goals.get(goalId);
    navPush({
      component: 'GoalStep',
      title: goal.get('title'),
      props: {
        goalId,
        stepIndex: goal.get('currentStepIndex'),
      },
    });
  }
  render() {
    const { goals, me } = this.props;
    return (
      <GoalList me={me} goals={goals} delegate={this} />
    );
  }
}

function mapStateToProps(state) {
  return {
    goals: state.get('goals'),
    me: state.get('me'),
  };
}


const { func, object } = PropTypes;
HOCGoalList.propTypes = {
  goals: map,
  navPush: func,
  delegate: object,
  me: map,
  // removeThis: PropTypes.string.isRequired
};

export default connect(mapStateToProps, {
  navPush: actions.navigation.push,
})(HOCGoalList);
