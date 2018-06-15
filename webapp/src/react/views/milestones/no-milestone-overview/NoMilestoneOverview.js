import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import EmptyState from '../../../components/empty-state/EmptyState';
import Icon from 'Icon';
import HOCGoalListItem from 'components/goal-list-item/HOCGoalListItem';
import HOCAddGoalItem from 'components/goal-list-item/HOCAddGoalItem';
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
      <HOCAddGoalItem
        key="add"
        defAssignees={[myId]}
        delegate={this}
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
