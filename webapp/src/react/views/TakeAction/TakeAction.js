import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setupDelegate } from 'react-delegate';
import EmptyState from '../../components/empty-state/EmptyState';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import SWView from 'SWView';
import GoalListSection from './GoalListSection';
import HOCGoalListItem from 'components/goal-list-item/HOCGoalListItem';
import GoalAdd from '../goals/goal-components/goal-add/GoalAdd';
import InfoButton from 'components/info-button/InfoButton';
import Icon from 'Icon';
import './styles/take-action.scss';


class TakeAction extends Component {
  constructor(props) {
    super(props);

    setupDelegate(this, 'onScroll');
  }
  renderHeader() {
    const { delegate, showLine } = this.props;

    return (
      <div className="goals-list__header">
        <HOCHeaderTitle
          title="Take Action"
          subtitle="See all your responsibilities and work on the most important goals."
        >
          <InfoButton
            delegate={delegate}
          />
        </HOCHeaderTitle>
      </div>
    );
  }
  renderList() {
    const { goals, plansOrder, delegate, myId } = this.props;
    const addGoal = (
      <GoalAdd
        key="add"
        defAssignees={[myId]}
      />
    );
    const filteredPlans = plansOrder.filter(planId => goals.get(planId)).push('none');

    return filteredPlans.map((planId) => {
      const planGoals = goals.get(planId);

      return (
          <GoalListSection
            delegate={delegate}
            id={planId}
            title={msgGen.milestones.getName(planId)}
            milestoneId={planId}
            icon={planId === 'none' ? 'MiniNoMilestone' : 'MiniMilestone'}
            key={planId}
          >
          {planGoals.toArray().map(goal => (
            <HOCGoalListItem
              goalId={goal.get('id')}
              key={goal.get('id')}
              inTakeAction={true}
              delegate={delegate}
            />
          ))}
          {planId === 'none' ? addGoal : null}
        </GoalListSection>
      )
    }).toArray();
  }
  renderEmptyState() {
    const { goals } = this.props;

    if (goals.size === 1 && !goals.get('none').size) {
      return (
         <EmptyState
          icon="ESArrow"
          title="ADD A NEW GOAL"
          description={`Add new goals for everything that needs \n to be done.`}
         />
       );
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
