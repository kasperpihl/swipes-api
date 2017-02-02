import React, { Component, PropTypes } from 'react';
import { map, list } from 'react-immutable-proptypes';
import { object, any, string } from 'valjs';
import { fromJS } from 'immutable';
import { bindAll, setupDelegate } from 'classes/utils';
import GoalsUtil from 'classes/goals-util';
import { filterGoals } from 'classes/filter-util';
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

    this.callDelegate = setupDelegate(props.delegate);
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
  getHelper(goal) {
    const { me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }
  clickedListItem(id) {
    this.callDelegate('goalListClickedGoal', id, this.refs.scroller.scrollTop);
  }
  filterGoals(goals) {
    const { tabIndex, me, tabs } = this.props;
    const filter = tabs.getIn([tabIndex, 'filter']);
    const user = filter.get('user') === 'me' ? me.get('id') : filter.get('user');
    return filterGoals(goals, filter.get('goalType'), user, filter.get('milestone'));
  }


  renderTabbar() {
    const {
      tabIndex,
      delegate,
      tabs,
    } = this.props;
    return (
      <div className="goals-list__tab-bar">
        <TabBar tabs={tabs.map(t => t.get('title')).toArray()} delegate={delegate} activeTab={tabIndex} />
      </div>
    );
  }
  renderFilter() {
    const { filterProp } = this.props;
    return (
      <Measure onMeasure={this.onFilterHeight}>
        <div className="goals-list__filter">
          <Filter
            onClick={(id, obj, e) => {
              this.callDelegate('onChangeFilter', obj, e);
            }}
            filter={filterProp.toJS()}
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
    const { tabIndex, tabs } = this.props;
    const { filterHeight } = this.state;
    let className = 'goals-list';
    const style = {};
    if (tabIndex === (tabs.size - 1)) {
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

const { object: obj, number, array } = PropTypes;

GoalList.propTypes = {
  goals: map.isRequired,
  tabs: list,
  savedState: map,
  tabIndex: number,
  me: map.isRequired,
  delegate: obj,
};

export default GoalList;
