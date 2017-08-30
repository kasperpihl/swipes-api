import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { setupDelegate } from 'react-delegate';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import SWView from 'SWView';
import GoalListSection from './GoalListSection';
import HOCGoalListItem from 'components/goal-list-item/HOCGoalListItem';
import HOCAddGoalItem from 'components/goal-list-item/HOCAddGoalItem';
import HOCInfoButton from 'components/info-button/HOCInfoButton';

import './styles/take-action.scss';

class TakeAction extends Component {
  constructor(props) {
    super(props);
    setupDelegate(this, 'onScroll');
  }
  renderHeader() {
    const { delegate, showLine, } = this.props;
    
    return (
      <div className="goals-list__header">
        <HOCHeaderTitle
          border={showLine}
          title="Take Action"
          subtitle="See all your responsibilities and work on the most important goals.">
          <HOCInfoButton
            delegate={delegate}
          />
        </HOCHeaderTitle>
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

    return goals.map((lGoals, section) => (
      <GoalListSection
        delegate={delegate}
        id={section}
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
  renderEmptyState() {
    const { goals } = this.props;

    if (goals.size === 1 && !goals.get('none').size) {
      return (
        <div className="take-action__empty-state">
          <div className="take-action__empty-arrow"></div>
          <div className="take-action__empty-text">
            Add new goals for everything that needs to be done
          </div>
        </div>
      )
    }

    return undefined;
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
        <div className="take-action">
          {this.renderList()}
          {this.renderEmptyState()}
        </div>
      </SWView>
    );
  }
}

const { object: obj, func } = PropTypes;

TakeAction.propTypes = {
  getLoading: func,
  delegate: obj,
};

export default TakeAction;
