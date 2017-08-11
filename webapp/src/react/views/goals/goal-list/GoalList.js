import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate } from 'swipes-core-js/classes/utils';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import SWView from 'SWView';
import Button from 'Button';
// import Icon from 'Icon';
import Section from 'components/section/Section';
import GoalListSection from './GoalListSection';
import HOCGoalListItem from 'components/goal-list-item/HOCGoalListItem';
import HOCAddGoalItem from 'components/goal-list-item/HOCAddGoalItem';

import './styles/goals-list.scss';

class GoalList extends Component {
  constructor(props) {
    super(props);
    setupDelegate(this, 'onScroll');
  }
  renderHeader() {
    const { getLoading, title, subtitle } = this.props;
    return (
      <div className="goals-list__header">
        <HOCHeaderTitle
          title={title || 'Take Action'}
          subtitle={subtitle || undefined}
        />
      </div>
    );
  }
  renderList() {
    const { goals, delegate, myId } = this.props;
    const addGoal = (
      <HOCAddGoalItem
        key="add"
        defAssignees={[myId]}
      />
    )
    if (!goals.size) {
      return addGoal;
    }

    return goals.map((lGoals, section) => (
      <GoalListSection
        title={msgGen.milestones.getName(section)}
        icon={section === 'none' ? 'MiniNoMilestone' : 'MiniMilestone'}
        key={section}
      >
        {lGoals.toArray().map(goal => (
          <HOCGoalListItem
            goalId={goal.get('id')}
            delegate={delegate}
            key={goal.get('id')}
          />
        ))}
        {section === 'none' ? addGoal : null}
      </GoalListSection>

    )).toArray();
  }
  render() {
    const { savedState } = this.props;
    const initialScroll = (savedState && savedState.get('scrollTop')) || 0;

    return (
      <SWView
        header={this.renderHeader()}
        onScroll={this.onScroll}
        initialScroll={initialScroll}
      >
        <div className="goals-list">
          {this.renderList()}
        </div>
      </SWView>
    );
  }
}

const { object: obj, func } = PropTypes;

GoalList.propTypes = {
  getLoading: func,
  delegate: obj,
};

export default GoalList;
