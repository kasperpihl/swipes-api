import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import { bindAll, setupDelegate } from 'classes/utils';
import GoalsUtil from 'classes/goals-util';
import TabBar from 'components/tab-bar/TabBar';
import GoalListItem from './GoalListItem';
import Measure from 'react-measure';
import Filter from './Filter';

import './styles/goals-list.scss';

class GoalList extends Component {
  constructor(props) {
    super(props);
    this.tabs = ['now', 'later', 'completed', 'all'];
    this.state = { filterHeight: 0 };
    this.callDelegate = setupDelegate(props.delegate, this);
    bindAll(this, ['clickedListItem', 'onFilterHeight']);
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
  onFilterHeight(dim) {
    this.setState({ filterHeight: dim.height });
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
  renderFilter() {
    return (
      <Measure onMeasure={this.onFilterHeight}>
        <div className="goals-list__filter">
          <Filter
            onClick={(id, obj, e) => {
              console.log('clicked', id, obj, e);
            }}
            filter={[
              { id: 'goal-type', string: 'All goals' },
              ' for ',
              { id: 'person', string: 'Anyone' },
              ' in ',
              { id: 'milestone', string: 'Any milestone' },
            ]}
          />
        </div>
      </Measure>
    );
  }
  renderList() {
    let { goals } = this.props;

    goals = goals.sort((a, b) => b.get('created_at').localeCompare(a.get('created_at'))).toArray();
    goals = this.filterGoals(goals);

    return goals.map(goal => <GoalListItem onClick={this.clickedListItem} me={this.props.me} data={goal} key={`goal-list-item-${goal.get('id')}`} />);
  }
  render() {
    const { tabIndex } = this.props;
    const { filterHeight } = this.state;
    let className = 'goals-list';
    const style = {};
    if (tabIndex === (this.tabs.length - 1)) {
      style.paddingTop = `${filterHeight}px`;
      className += ' goals-list--show-filters';
    }
    return (
      <div className={className}>
        {this.renderTabbar()}
        <div className="goals-list__scroller" style={style} ref="scroller">
          {this.renderFilter()}
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
