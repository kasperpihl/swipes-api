import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import { object, any, string } from 'valjs';

import { bindAll, setupDelegate } from 'classes/utils';
import GoalsUtil, { filterGoals } from 'classes/goals-util';
import TabBar from 'components/tab-bar/TabBar';
import Measure from 'react-measure';
import GoalListItem from './GoalListItem';
import FilterFooter from './FilterFooter';

import Filter from './Filter';

import './styles/goals-list.scss';

const validFilter = object.as({
  user: any.of(
    'me',
    'none',
    'any',
    string),
  goalType: any.of(['all', 'completed', 'current', 'upcoming']),
  milestone: any.of([
    'any',
    'none',
    string,
  ]),
});

class GoalList extends Component {
  constructor(props) {
    super(props);
    this.state = { filterHeight: 0 };
    this.tabs = [{
      title: 'Current',
      filter: {
        user: 'me',
        goalType: 'current',
        milestone: 'any',
      },
    }, {
      title: 'Upcoming',
      filter: {
        user: 'me',
        goalType: 'upcoming',
        milestone: 'any',
      },
    }, {
      title: 'Filter',
    }];

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
    const { tabIndex, me } = this.props;
    const tab = this.tabs[tabIndex];
    const { filter } = tab;
    const error = validFilter.test(filter);
    if (filter) {
      const user = filter.user === 'me' ? me.get('id') : filter.user;
      return filterGoals(goals, filter.goalType, user, filter.milestone);
    }
    return goals;
  }
  getHelper(goal) {
    const { me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }

  renderTabbar() {
    const {
      tabIndex,
      delegate,
    } = this.props;
    return (
      <div className="goals-list__tab-bar">
        <TabBar tabs={this.tabs.map(t => t.title)} delegate={delegate} activeTab={tabIndex} />
      </div>
    );
  }
  renderFilter() {
    return (
      <Measure onMeasure={this.onFilterHeight}>
        <div className="goals-list__filter">
          <Filter
            onClick={(id, obj, e) => {
              console.log('yo', id, obj, e);
            }}
            filter={[
              'Show ',
              { id: 'goal-type', string: 'all goals' },
              ' related to ',
              { id: 'milestone', string: 'any milestone' },
              ' and assigned to ',
              { id: 'person', string: 'anyone' },
              '.',
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
  renderFilterFooter() {
    return <FilterFooter />;
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
        {this.renderFilterFooter()}
      </div>
    );
  }
}

const { object: obj, number } = PropTypes;

GoalList.propTypes = {
  goals: map.isRequired,
  savedState: map,
  tabIndex: number,
  me: map.isRequired,
  delegate: obj,
};

export default GoalList;
