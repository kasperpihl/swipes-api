import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';

import Icon from 'Icon';
import HOCGoalListItem from 'components/goal-list-item/HOCGoalListItem';
import GoalAdd from '../../goals/goal-components/goal-add/GoalAdd';
import './styles/no-milestone-overview.scss';

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
      <div className="no-milestone-overview__header">
        <HOCHeaderTitle
          title="Goals without a plan"
          border
        />
      </div>
    );
  }
  renderEmptyState() {
    const { goals } = this.props;

    if (!goals.size) {
      return (
        <div className="no-milestone-overview__empty-state">
          <div className="no-milestone-overview__empty-arrow">
            <Icon icon="ESArrow" className="no-milestone-overview__empty-arrow-svg" />
          </div>
          <div className="no-milestone-overview__empty-title">
            Add a new goal
          </div>
          <div className="no-milestone-overview__empty-text">
            Add new goals for everything that needs <br /> to be done.
          </div>
        </div>
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
        <div className="no-milestone-overview">
          {this.renderList()}
          {this.renderEmptyState()}
        </div>
      </SWView>
    );
  }
}

export default NoMilestoneOverview;
