import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
// import Button from 'Button';
// import Icon from 'Icon';
// import './styles/NoMilestoneOverview.scss';
import HOCGoalListItem from 'components/goal-list-item/HOCGoalListItem';
import HOCAddGoalItem from 'components/goal-list-item/HOCAddGoalItem';
import './styles/no-milestone-overview.scss';

class NoMilestoneOverview extends PureComponent {
  constructor(props) {
    super(props);
    setupDelegate(this, 'onScroll');
  }
  renderHeader() {
    return (
      <div className="no-milestone-overview__header">
        <HOCHeaderTitle
          title="Goals without a milestone"
        />
      </div>
    );
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
        </div>
      </SWView>
    );
  }
}

export default NoMilestoneOverview

// const { string } = PropTypes;

NoMilestoneOverview.propTypes = {};
