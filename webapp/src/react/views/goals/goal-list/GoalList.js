import React, { Component, PropTypes } from 'react';
import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate } from 'classes/utils';
import GoalsUtil from 'classes/goals-util';
import TabBar from 'components/tab-bar/TabBar';
import Button from 'Button';
import Measure from 'react-measure';
import GoalListItem from './GoalListItem';
import FilterFooter from './FilterFooter';

import Filter from './Filter';

import './styles/goals-list.scss';

class GoalList extends Component {
  constructor(props) {
    super(props);
    this.state = { filterHeight: 0 };

    this.callDelegate = setupDelegate(props.delegate);
    this.clearFilter = this.callDelegate.bind(null, 'onClearFilter');
    this.hideFilter = this.callDelegate.bind(null, 'onHideFilter');
    this.editFilter = this.callDelegate.bind(null, 'onEditFilter');
    this.onAssignClick = this.callDelegate.bind(null, 'onAssignClick');
    bindAll(this, ['clickedListItem', 'onFilterHeight']);
  }
  onFilterHeight(dim) {
    this.setState({ filterHeight: dim.height });
  }
  getHelper(goal) {
    const { me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }
  clickedListItem(id) {
    this.callDelegate('onClickGoal', id);
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

          <div className="goals-list__filter-actions">
            <div className="goals-list__filter-action" onClick={this.clearFilter}>Clear filter</div>
            <div
              className="goals-list__filter-action goals-list__filter-action--main"
              onClick={this.hideFilter}
            >
              Hide
            </div>
          </div>
        </div>
      </Measure>
    );
  }
  renderList() {
    const { goals, tabs, tabIndex, addGoal } = this.props;
    const filter = tabs.getIn([tabIndex, 'filter']);

    if (filter.get('goalType') === 'current' && !goals.length) {
      return (
        <div className="goals-empty-state">
          <div className="goals-empty-state__title">Goals</div>
          <div className="goals-empty-state__message">Here you can create new goals, track current ones and accomplish them with your team. Let's get started.</div>
          <Button primary text="Create your first goal" className="goals-empty-state__button" onClick={addGoal} />
        </div>
      );
    } else {
      return goals.map(goal => (
        <GoalListItem
          onClick={this.clickedListItem}
          onAssignClick={this.onAssignClick}
          me={this.props.me}
          filter={filter}
          goal={goal}
          key={`goal-list-item-${goal.get('id')}`}
        />
      ));
    }
  }
  renderFilterFooter() {
    const { filterLabel, showFilter, delegate, tabs, tabIndex } = this.props;
    return (
      <FilterFooter
        status={filterLabel}
        delegate={delegate}
        disableEdit={showFilter || (tabIndex !== (tabs.size - 1))}
      />
    );
  }
  render() {
    const { showFilter, tabIndex } = this.props;
    const { filterHeight } = this.state;
    let className = 'goals-list';
    const style = {};
    if (showFilter) {
      style.paddingTop = `${filterHeight}px`;
      className += ' goals-list--show-filters';
    }
    return (
      <div className={className} style={style} key={tabIndex}>
        {this.renderFilter()}
        {this.renderList()}
        {this.renderFilterFooter()}
      </div>
    );
  }
}

const { object: obj, number, array, bool, string } = PropTypes;

GoalList.propTypes = {
  goals: array.isRequired,
  tabs: list,
  showFilter: bool,
  filterProp: list,
  filterLabel: string,
  tabIndex: number,
  me: map.isRequired,
  delegate: obj,
};

export default GoalList;
