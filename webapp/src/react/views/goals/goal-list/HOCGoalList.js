import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { connect } from 'react-redux';
import { fromJS, Set } from 'immutable';
import { map } from 'react-immutable-proptypes';
import { setupDelegate, bindAll, setupLoading } from 'swipes-core-js/classes/utils';
import {
  EditorState,
  convertToRaw,
} from 'draft-js';

import GoalList from './GoalList';

/* global msgGen*/

class HOCGoalList extends PureComponent {
  constructor(props) {
    super(props);
    setupDelegate(this);
    this.state = {
      tabs: ['current', 'starred', 'unassigned', 'default'],
      tabIndex: 0,
      showFilter: false,
      filterProp: fromJS([
        { id: 'goalType' },
        ' assigned to ',
        { id: 'userId' },
        ' in ',
        { id: 'milestoneId' },
      ]),
    };
    setupLoading(this);
    if (props.savedState) {
      this.state.tabIndex = Math.min(this.state.tabs.length - 1, props.savedState.get('tabIndex'));
    }
    const { tabIndex, tabs } = this.state;

    if (tabIndex === (tabs.length - 1)) {
      this.state.showFilter = true;
    }
  }

  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.goals !== this.props.goals) {
      this.updateFilter({});
    }
  }

  onScroll(e) {
    this._scrollTop = e.target.scrollTop;
  }
  onGoalClick(goalId) {
    const { navPush } = this.props;

    this.saveState();
    window.analytics.sendEvent('Goal opened', {});
    navPush({
      id: 'GoalOverview',
      title: 'Goal overview',
      props: {
        goalId,
      },
    });
  }
  onEditFilter() {
    this.setState({ showFilter: true });
  }
  onHideFilter() {
    this.setState({ showFilter: false });
  }
  onClearFilter() {
    const { clearFilter } = this.props;
    clearFilter('goals', 'default');
  }

  onChangeFilter(obj, e) {
    const options = {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'center',
    };
    if (obj.id === 'goalType') {
      const { selectGoalType } = this.props;
      selectGoalType(options, res => this.updateFilter({ goalType: res.id }));
    }
    if (obj.id === 'userId') {
      const { selectUser } = this.props;
      selectUser(options, res => this.updateFilter({ userId: res.id }));
    }
    if (obj.id === 'milestoneId') {
      const { selectMilestone } = this.props;
      selectMilestone(options, res => this.updateFilter({ milestoneId: res.id }));
    }
    if (obj.id === 'matching') {
      const { inputMenu } = this.props;
      const { tabs, tabIndex } = this.state;
      const text = this.props.filters.getIn([tabs[tabIndex], 'filter', 'matching']);
      inputMenu({
        ...options,
        buttonLabel: 'Search',
        placeholder: 'Search goal and step titles',
        allowEmpty: true,
        text,
      }, res => this.updateFilter({ matching: res }));
    }
  }
  onAddGoal(e) {
    const { inputMenu, createGoal } = this.props;
    const options = this.getOptionsForE(e);
    inputMenu({
      ...options,
      placeholder: 'What do you need to do?',
      buttonLabel: 'Add Goal',
    }, (title) => {
      if (title && title.length) {
        this.setLoading('add');
        this.tabDidChange(this.state.tabs.indexOf('unassigned'));
        createGoal(title).then((res) => {
          if (res && res.ok) {
            this.clearLoading('add');
            window.analytics.sendEvent('Goal created', {});
          } else {
            this.clearLoading('add', '!Something went wrong');
          }
        });
      }
    });
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
  }
  saveState() {
    const { saveState } = this.props;
    const { tabIndex } = this.state;
    const savedState = {
      tabIndex,
      scrollTop: this._scrollTop,
    }; // state if this gets reopened
    saveState(savedState);
  }
  updateFilter(mergeObj) {
    const { saveCache, filters, updateFilter } = this.props;
    const { tabs, tabIndex } = this.state;
    const filter = filters.getIn([tabs[tabIndex], 'filter']);
    if (tabIndex === (tabs.size - 1)) {
      saveCache('list-filter', newFilter);
    }
    updateFilter('goals', 'default', filter.merge(mergeObj));
  }

  tabDidChange(index) {
    const { tabIndex, tabs } = this.state;
    if (tabIndex !== index) {
      const showFilter = (index === (tabs.length - 1));
      this.setState({
        tabIndex: index,
        showFilter,
      });
    } else if (index === (tabs.length - 1)) {
      if (!this.state.showFilter) {
        this.setState({ showFilter: true });
      }
    }
  }
  render() {
    const { me, savedState, filters, goals, starredGoals: sG } = this.props;
    const {
      tabIndex,
      tabs,
      showFilter,
      filterProp,
    } = this.state;
    let goalFilter = filters.get(tabs[tabIndex]);

    goalFilter = goalFilter.set('goals', goalFilter.get('goals').sort((g1, g2) => {
      const g1StarI = sG.indexOf(g1);
      const g2StarI = sG.indexOf(g2);

      if (g1StarI > g2StarI) {
        return -1;
      }

      if (g2StarI > g1StarI) {
        return 1;
      }

      return goals.getIn([g2, 'created_at']).localeCompare(goals.getIn([g1, 'created_at']));
    }));

    return (
      <GoalList
        goals={goalFilter.get('goals')}
        filter={goalFilter.get('filter')}
        tabIndex={tabIndex}
        savedState={savedState}
        {...this.bindLoading()}
        delegate={this}
        tabs={tabs.map((tId, i) => {
          let title = filters.getIn([tId, 'title']);
          const size = filters.getIn([tId, 'goals']).size;
          if (i < (tabs.length - 1) && size) {
            title += ` (${size})`;
          }
          return title;
        })}
        filterProp={filterProp}
        showFilter={showFilter}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    goals: state.get('goals'),
    filters: state.getIn(['filters', 'goals']),
    cache: state.getIn(['cache', 'list-filter']),
    starredGoals: state.getIn(['me', 'settings', 'starred_goals']),
  };
}


const { func, object } = PropTypes;
HOCGoalList.propTypes = {
  goals: map,
  cache: map,
  savedState: object,
  saveCache: func,
  saveState: func,
  createGoal: func,
  openSecondary: func,
  navPush: func,
  delegate: object,
  inputMenu: func,
  selectUser: func,
  selectAssignees: func,
  selectGoalType: func,
  selectMilestone: func,
  // removeThis: PropTypes.string.isRequired
};

export default connect(mapStateToProps, {
  saveCache: ca.cache.save,
  createGoal: ca.goals.create,
  selectUser: a.menus.selectUser,
  selectMilestone: a.menus.selectMilestone,
  clearFilter: ca.filters.clear,
  updateFilter: ca.filters.update,
  inputMenu: a.menus.input,
  selectGoalType: a.menus.selectGoalType,
  selectAssignees: a.goals.selectAssignees,
})(HOCGoalList);
