import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import { bindAll, setupDelegate } from 'classes/utils';
import GoalsUtil from 'classes/goals-util';
import TabBar from 'components/tab-bar/TabBar';
import GoalListItem from './GoalListItem';


import './styles/goals-list.scss';

class GoalList extends Component {
  constructor(props) {
    super(props);
    this.tabs = ['now', 'later', 'completed', 'all'];
    this.callDelegate = setupDelegate(props.delegate, this);
    bindAll(this, ['clickedListItem']);
  }
  componentDidMount() {
    const { savedState } = this.props;
    if (savedState) {
      const scrollTop = savedState.get('scrollTop');
      if (scrollTop > 0) {
        this.refs.scroller.scrollTop = scrollTop;
      }
    }
  }
  clickedListItem(id) {
    this.callDelegate('goalListClickedGoal', id, this.refs.scroller.scrollTop);
  }
  filterGoals(goals) {
    const { tabIndex } = this.props;

    switch (tabIndex) {
      case 0:
        return this.filterMine(goals);
      case 1:
        return this.filterLater(goals);
      case 2:
        return this.filterCompleted(goals);
      case 3:
        return goals;
      default:
        return this.filterMine(goals);
    }
  }
  getHelper(goal) {
    const { me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }
  filterCompleted(goals) {
    return goals.filter(goal => (!goal.getIn(['status', 'current_step_id'])));
  }
  filterMine(goals) {
    return goals.filter((goal) => {
      const helper = this.getHelper(goal);
      return helper.amIAssigned();
    });
  }
  filterLater(goals) {
    const { me } = this.props;
    return goals.filter((goal) => {
      const helper = this.getHelper(goal);
      if (helper.amIAssigned() || helper.getIsCompleted()) {
        return false;
      }
      return helper.getRemainingAssignees().contains(me.get('id'));
    });
  }
  renderTabbar() {
    const {
      tabIndex,
      delegate,
    } = this.props;
    return (
      <div className="goals-list__tab-bar">
        <TabBar tabs={this.tabs} delegate={delegate} activeTab={tabIndex} />
      </div>
    );
  }
  renderList() {
    let { goals } = this.props;

    goals = goals.sort((a, b) => b.get('created_at').localeCompare(a.get('created_at'))).toArray();
    goals = this.filterGoals(goals);

    return goals.map(goal => <GoalListItem onClick={this.clickedListItem} me={this.props.me} data={goal} key={`goal-list-item-${goal.get('id')}`} />);
  }
  render() {
    let className = 'goals-list';

    if (false) {
      className += ' goals-list--show-filters';
    }
    return (
      <div className={className}>
        {this.renderTabbar()}
        <div className="goals-list__scroller" ref="scroller">
          <div className="goals-list__filter" />
          {this.renderList()}
        </div>
      </div>
    );
  }
}

const { object, number } = PropTypes;

GoalList.propTypes = {
  goals: map.isRequired,
  savedState: map,
  tabIndex: number,
  me: map.isRequired,
  delegate: object,
};

export default GoalList;
