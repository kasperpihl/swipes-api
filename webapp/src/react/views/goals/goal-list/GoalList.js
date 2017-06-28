import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate } from 'swipes-core-js/classes/utils';
import TabBar from 'components/tab-bar/TabBar';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import Filter from 'components/filter/Filter';
import SWView from 'SWView';
import Button from 'Button';
import Icon from 'Icon';
import Measure from 'react-measure';
import HOCGoalListItem from 'components/goal-list-item/HOCGoalListItem';
import FilterFooter from './FilterFooter';


import './styles/goals-list.scss';

class GoalList extends Component {
  constructor(props) {
    super(props);
    this.state = { filterHeight: 0 };

    setupDelegate(this);
    this.clearFilter = this.callDelegate.bind(null, 'onClearFilter');
    this.hideFilter = this.callDelegate.bind(null, 'onHideFilter');
    this.editFilter = this.callDelegate.bind(null, 'onEditFilter');
    this.onScroll = this.callDelegate.bind(null, 'onScroll');
    this.onAddGoal = this.callDelegate.bind(null, 'onAddGoal');
    bindAll(this, ['clickedListItem', 'onFilterHeight']);
  }
  onFilterHeight(dim) {
    this.setState({ filterHeight: dim.height });
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
        <TabBar tabs={tabs} delegate={delegate} activeTab={tabIndex} />
      </div>
    );
  }
  renderHeader() {
    const { getLoading } = this.props;
    return (
      <div className="goals-list__header">
        <HOCHeaderTitle title="Take Action">
          <Button
            text="Add a goal"
            primary
            {...getLoading('add') }
            onClick={this.onAddGoal}
          />
        </HOCHeaderTitle>
        {this.renderTabbar()}
      </div>
    );
  }
  renderSearch() {
    return <input type="text" />;
  }
  renderFilter() {
    const { filterProp, filter } = this.props;
    const filterArray = filterProp.map((p) => {
      if (typeof p === 'string') {
        return p;
      }
      let newString;

      if (p.get('id') === 'goalType') {
        newString = msgGen.goals.getType(filter.get('goalType'));
      } else if (p.get('id') === 'userId') {
        newString = msgGen.users.getName(filter.get('userId'));
      } else if (p.get('id') === 'milestoneId') {
        return p.set('string', msgGen.milestones.getName(filter.get('milestoneId')));
      } else if (p.get('id') === 'matching') {
        if (!filter.get('matching') || !filter.get('matching').length) {
          return p.set('string', 'anything');
        }
        return p.set('string', `"${filter.get('matching')}"`);
      }
      if (newString !== p.get('string')) {
        return p.set('string', newString);
      }

      return p;
    }).toJS();

    return (
      <Measure onMeasure={this.onFilterHeight}>
        <div className="goals-list__filter">
          <div className="goals-list__search">
            <input type="text"
              placeholder="Search for goals"
              value={filter.get('matching') || ''}
              onChange={(e) => {
                this.callDelegate('onChangeFilter', {
                  id: 'matching',
                  value: e.target.value,
                }, e);
              }}
            />
            <Icon icon="Find" className="goals-list__search-svg" />
          </div>
          <div className="goals-list__filter-wrap">
            <Filter
              onClick={(id, obj, e) => {
                this.callDelegate('onChangeFilter', obj, e);
              }}
              filter={filterArray}
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
        </div>
      </Measure>
    );
  }
  renderList() {
    const { filter, goals, delegate, numberOfStars } = this.props;

    if (filter.get('goalType') === 'current' && !goals.size) {
      return (
        <div className="goals-empty-state">
          <div className="goals-empty-state__title">Goals</div>
          <div className="goals-empty-state__message">
            Here you can create new goals,&nbsp;
            {'track current ones and accomplish them with your team. Let\'s get started.'}
          </div>
          <Button
            primary
            text="Create a goal"
            className="goals-empty-state__button"
            onClick={this.onAddGoal}
          />
        </div>
      );
    }

    const i = 0;
    return goals.map(goalId => (
      <HOCGoalListItem
        goalId={goalId}
        delegate={delegate}
        key={goalId}
      />
    ));
  }
  renderFilterFooter() {
    const { filter, goals, showFilter, delegate, tabs, tabIndex } = this.props;
    return (
      <FilterFooter
        status={msgGen.goals.getFilterLabel(goals.size, filter)}
        delegate={delegate}
        disableEdit={showFilter || (tabIndex !== (tabs.length - 1))}
      />
    );
  }
  render() {
    const { showFilter, tabIndex, savedState } = this.props;
    const { filterHeight } = this.state;
    let className = 'goals-list';
    const style = {};
    if (showFilter) {
      style.paddingTop = `${filterHeight}px`;
      className += ' goals-list--show-filters';
    }
    const initialScroll = (savedState && savedState.get('scrollTop')) || 0;
    return (
      <SWView
        header={this.renderHeader()}
        onScroll={this.onScroll}
        initialScroll={initialScroll}
      >
        <div className={className} style={style} key={tabIndex}>
          {this.renderFilter()}
          {this.renderFilterFooter()}
          {this.renderList()}
        </div>
      </SWView>
    );
  }
}

const { object: obj, number, array, bool, string, func } = PropTypes;

GoalList.propTypes = {
  tabs: array,
  numberOfStars: number,
  showFilter: bool,
  filterProp: list,
  filterLabel: string,
  getLoading: func,
  tabIndex: number,
  delegate: obj,
};

export default GoalList;
