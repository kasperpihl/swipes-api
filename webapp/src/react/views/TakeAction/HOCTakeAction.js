import React, { PureComponent } from 'react';
import * as ca from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';
import { connect } from 'react-redux';
import {
  EditorState,
  convertToRaw,
} from 'draft-js';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import TakeAction from './TakeAction';

@navWrapper
@connect(state => ({
  organization: state.me.getIn(['organizations', 0]),
  goals: cs.goals.assignedGroupedByMilestone(state),
  myId: state.me.get('id'),
}), {
  saveCache: ca.cache.save,
})

export default class HOCTakeAction extends PureComponent {
  static maxWidth() {
    return 654;
  }
  constructor(props) {
    super(props);
    this.state = {
      showLine: false,
    };
  }
  onScroll(e) {
    const { showLine } = this.state;
    let newShowLine = e.target.scrollTop > 0;

    if (showLine !== newShowLine) {
      this.setState({ showLine: newShowLine })
    }

    this._scrollTop = e.target.scrollTop;
  }
  onGoalClick(goalId) {
    const { navPush } = this.props;

    this.saveState();
    window.analytics.sendEvent('Goal opened', {});
    navPush({
      id: 'GoalOverview',
      title: 'Goal overview',
      props: {
        goalId,
      },
    });
  }
  onGoalSectionClick(milestoneId) {
    const { navPush } = this.props;
    this.saveState();
    if(milestoneId === 'none') {
      navPush({
        id: 'NoMilestoneOverview',
        title: 'Goals without a plan',
      });
      return;
    }
    navPush({
      id: 'PlanOverview',
      title: 'Plan overview',
      props: {
        milestoneId,
      },
    });
  }
  getInfoTabProps() {
    return {
      about: {
        title: 'What is Take Action',
        text: 'Take Action is one of the 3 main sections of the Workspace: Plan, Take Action and Discuss.\n\nUnder Take Action you can see all the goals you are responsible for across the company plans. You can evaluate what is the most important thing to work on and take action on it.'
      },
    }
  }
  saveState() {
    const { saveState } = this.props;
    const savedState = {
      scrollTop: this._scrollTop,
    }; // state if this gets reopened
    saveState(savedState);
  }

  render() {
    const { savedState, goals, organization, myId } = this.props;
    const { showLine } = this.state;

    return (
      <TakeAction
        goals={goals}
        plansOrder={organization.get('milestone_order')}
        savedState={savedState}
        delegate={this}
        myId={myId}
        showLine={showLine}
      />
    );
  }
}
