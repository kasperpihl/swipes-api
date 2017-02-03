import React, { Component, PropTypes } from 'react';
import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate } from 'classes/utils';
import GoalsUtil from 'classes/goals-util';
import TabBar from 'components/tab-bar/TabBar';
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
    this.callDelegate('onClickGoal', id, this.refs.scroller.scrollTop);
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
    const { goals } = this.props;
    return goals.map(goal => <GoalListItem onClick={this.clickedListItem} me={this.props.me} data={goal} key={`goal-list-item-${goal.get('id')}`} />);
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
    const { showFilter } = this.props;
    const { filterHeight } = this.state;
    let className = 'goals-list';
    const style = {};
    if (showFilter) {
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

const { object: obj, number, array, bool, string } = PropTypes;

GoalList.propTypes = {
  goals: array.isRequired,
  tabs: list,
  showFilter: bool,
  filterProp: list,
  filterLabel: string,
  savedState: map,
  tabIndex: number,
  me: map.isRequired,
  delegate: obj,
};

export default GoalList;
