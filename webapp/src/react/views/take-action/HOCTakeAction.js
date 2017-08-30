import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import {
  EditorState,
  convertToRaw,
} from 'draft-js';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import TakeAction from './TakeAction';

class HOCTakeAction extends PureComponent {
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
    if(milestoneId === 'none') {
      navPush({
        id: 'NoMilestoneOverview',
        title: 'No Milestone',
      });
      return;
    }
    navPush({
      id: 'MilestoneOverview',
      title: 'Milestone overview',
      props: {
        milestoneId,
      },
    });
  }
  getInfoTabProps() {
    return {
      about: {
        title: 'What is Take Action',
        text: 'Take Action is one of the 3 main sections of the Workspace: Plan, Take Action and Discuss.\n\nUnder Take Action you can see all the goals you are responsible for across the company milestones. You can evaluate what is the most important thing to work on and take action on it.'
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
    const { savedState, goals, myId } = this.props;
    const { showLine } = this.state;

    return (
      <TakeAction
        goals={goals}
        savedState={savedState}
        delegate={this}
        myId={myId}
        showLine={showLine}
      />
    );
  }
}

const { func, object } = PropTypes;
HOCTakeAction.propTypes = {
  goals: map,
  savedState: object,
  saveState: func,
  openSecondary: func,
  navPush: func,
  delegate: object,
};

const mapStateToProps = state => ({
  goals: cs.goals.assignedGroupedByMilestone(state),
  myId: state.getIn(['me', 'id']),
});

export default navWrapper(connect(mapStateToProps, {
  saveCache: ca.cache.save,
})(HOCTakeAction));
