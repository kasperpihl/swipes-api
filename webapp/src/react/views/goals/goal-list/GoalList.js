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

import './styles/goals-list.scss';

class GoalList extends Component {
  constructor(props) {
    super(props);
    setupDelegate(this, 'onScroll', 'onAddGoal');
  }
  renderHeader() {
    const { getLoading } = this.props;
    return (
      <div className="goals-list__header">
        <HOCHeaderTitle title="Take Action">
          <Button
            text="Add a goal"
            primary
            {...getLoading('add') }
            onClick={this.onAddGoal}
          />
        </HOCHeaderTitle>
      </div>
    );
  }
  renderList() {
    const { goals, delegate } = this.props;

    if (!goals.size) {
      return (
        <div className="goals-empty-state">
          <div className="goals-empty-state__title">Goals</div>
          <div className="goals-empty-state__message">
            Here you can create new goals,&nbsp;
            {'track current ones and accomplish them with your team. Let\'s get started.'}
          </div>
          <Button
            primary
            text="Create a goal"
            className="goals-empty-state__button"
            onClick={this.onAddGoal}
          />
        </div>
      );
    }

    const i = 0;

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
