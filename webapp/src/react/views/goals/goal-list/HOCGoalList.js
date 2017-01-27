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
        text: 'New Goal',
        primary: true,
      },
    }];
  }

  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.delegate);
    this.state = { tabIndex: 0 };
    if (props.savedState) {
      this.state.tabIndex = props.savedState.get('tabIndex');
    }
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
  }
  onContextClick() {
    const { navPush } = this.props;
    const { tabIndex } = this.state;
    const savedState = {
      tabIndex,
    };
    navPush({
      component: 'AddGoal',
      title: 'Add Goal',
      placeholder: 'Goal title',
    },
    savedState);
  }
  tabDidChange(nav, index) {
    if (this.state.tabIndex !== index) {
      this.setState({ tabIndex: index });
    }
  }
  goalListClickedGoal(goalList, goalId, scrollTop) {
    const {
      navPush,
      goals,
    } = this.props;
    const {
      tabIndex,
    } = this.state;
    const savedState = {
      tabIndex,
      scrollTop,
    }; // state if this gets reopened
    const goal = goals.get(goalId);
    navPush({
      component: 'GoalStep',
      title: goal.get('title'),
      props: {
        goalId,
      },
    },
    savedState);
  }
  render() {
    const { goals, me, savedState } = this.props;
    const { tabIndex } = this.state;
    return (
      <GoalList
        me={me}
        tabIndex={tabIndex}
        savedState={savedState}
        goals={goals}
        delegate={this}
      />
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
  savedState: object,
  navPush: func,
  delegate: object,
  me: map,
  // removeThis: PropTypes.string.isRequired
};

export default connect(mapStateToProps, {
  navPush: actions.navigation.push,
})(HOCGoalList);
