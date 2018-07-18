import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import SWView from 'SWView';
import HOCHeaderTitle from 'src/react/components/header-title/HOCHeaderTitle';
import EmptyState from 'src/react/components/empty-state/EmptyState';
import Icon from 'Icon';
import HOCGoalListItem from 'src/react/components/goal-list-item/HOCGoalListItem';
import GoalAdd from 'src/react/views/goals/goal-components/goal-add/GoalAdd';

class NoMilestoneOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLine: false,
    };
    setupDelegate(this, 'onScroll');
  }
  renderHeader() {
    return (
      <HOCHeaderTitle
        title="Goals without a plan"
        border
      />
    );
  }
  renderEmptyState() {
    const { goals } = this.props;

    if (!goals.size) {
      return (
        <EmptyState
          icon="ESArrow"
          title="ADD A NEW GOAL"
          description={`Add new goals for everything that needs \n to be done.`}
         />
      )
    }

    return undefined;
  }
  renderList() {
    const { goals, delegate, myId, limit } = this.props;
    let i = 0;
    return goals.map(goal => (i++ <= limit) ? (
      <HOCGoalListItem
        goalId={goal.get('id')}
        delegate={delegate}
        key={goal.get('id')}
      />
    ) : null).toArray().concat([
      <GoalAdd
        key="add"
        defAssignees={[myId]}
      />
    ])
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
        {this.renderList()}
        {this.renderEmptyState()}
      </SWView>
    );
  }
}

export default NoMilestoneOverview;
