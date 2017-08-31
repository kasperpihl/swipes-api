import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
// import Button from 'Button';
import Icon from 'Icon';
// import './styles/NoMilestoneOverview.scss';
import HOCGoalListItem from 'components/goal-list-item/HOCGoalListItem';
import HOCAddGoalItem from 'components/goal-list-item/HOCAddGoalItem';
import './styles/no-milestone-overview.scss';

class NoMilestoneOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLine: false,
      emptyStateOpacity: 1,
    }
    setupDelegate(this, 'onScroll');
  }
  onAddGoalItemInputChange(title) {
    const { emptyStateOpacity } = this.state;
    const newEmptyStateOpacity = Math.max((10 - title.length) / 10, 0);

    if (emptyStateOpacity !== newEmptyStateOpacity) {
      this.setState({ emptyStateOpacity: newEmptyStateOpacity })
    }
  }
  renderHeader() {
    return (
      <div className="no-milestone-overview__header">
        <HOCHeaderTitle
          title="Goals without a milestone"
          border
        />
      </div>
    );
  }
  renderEmptyState() {
    const { goals } = this.props;

    if (!goals.size) {
      return (
        <div className="no-milestone-overview__empty-state" style={{ opacity: this.state.emptyStateOpacity }}>
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
    const { goals, delegate, myId } = this.props;

    return goals.map(goal => (
      <HOCGoalListItem
        goalId={goal.get('id')}
        delegate={delegate}
        key={goal.get('id')}
      />
    )).toArray().concat([
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

export default NoMilestoneOverview

// const { string } = PropTypes;

NoMilestoneOverview.propTypes = {};
