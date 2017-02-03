import React, { Component, PropTypes } from 'react';
import * as a from 'actions';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { map } from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { setupDelegate } from 'classes/utils';
import {
  getGoalTypeForValue,
  getUserStringForValue,
  getMilestoneStringForValue,
  getFilterLabel,
  filterGoals,
} from 'classes/filter-util';
import GoalList from './GoalList';

const defaultFilter = fromJS({
  user: 'any',
  goalType: 'all',
  milestone: 'any',
});

class HOCGoalList extends Component {
  static contextButtons() {
    return [{
      component: 'Button',
      props: {
        text: 'New Goal',
        primary: true,
      },
    }];
  }

  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.delegate);
    this.state = {
      tabIndex: 0,
      tabs: fromJS([{
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
        filter: defaultFilter,
      }]),
      showFilter: false,
      filterProp: fromJS([
        { id: 'goalType' },
        ' assigned to ',
        { id: 'user' },
        ' with ',
        { id: 'milestone' },
      ]),
    };
    if (props.savedState) {
      this.state.tabIndex = props.savedState.get('tabIndex');
    }
    const { tabIndex, filterProp, tabs } = this.state;
    if (props.cache) {
      this.state.tabs = tabs.setIn([tabs.size - 1, 'filter'], props.cache);
    }

    const filter = this.state.tabs.getIn([tabIndex, 'filter']);
    if (tabIndex === (tabs.size - 1)) {
      this.state.showFilter = true;
    }
    this.state.filterProp = this.updateFilterProp(filterProp, tabIndex);
    this.state.filteredGoals = this.filterGoals(filter);
    this.state.filterLabel = this.updateFilterLabel(filter, this.state.filteredGoals);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.goals !== this.props.goals) {
      const newFilteredGoals = this;
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.goals !== this.props.goals) {
      this.updateFilter({});
    }
  }
  onEditFilter() {
    console.log('showing!');
    this.setState({ showFilter: true });
  }
  onHideFilter() {
    this.setState({ showFilter: false });
  }
  onClearFilter() {
    this.updateFilter(defaultFilter);
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
    if (obj.id === 'user') {
      const { selectUser } = this.props;
      selectUser(options, res => this.updateFilter({ user: res.id }));
    }
    if (obj.id === 'milestone') {
      const { selectMilestone } = this.props;
      // selectMilestone(options, res => updateState(obj.id, res.id));
    }
  }

  onContextClick() {
    const { navPush } = this.props;
    const { tabIndex } = this.state;
    const savedState = {
      tabIndex,
    };
    navPush({
      component: 'AddGoal',
      title: 'Add Goal',
      placeholder: 'Goal title',
    },
    savedState);
  }
  updateFilter(mergeObj) {
    const { saveCache } = this.props;
    const { tabs, filterProp, tabIndex } = this.state;
    const newTabs = tabs.mergeIn([tabIndex, 'filter'], mergeObj);
    const newFilter = newTabs.getIn([tabIndex, 'filter']);
    const newFilterProp = this.updateFilterProp(filterProp, tabIndex, newFilter);
    const filteredGoals = this.filterGoals(newFilter);
    const filterLabel = this.updateFilterLabel(newFilter, filteredGoals);
    if (tabIndex === (tabs.size - 1)) {
      saveCache('list-filter', newFilter);
    }
    this.setState({
      tabs: newTabs,
      filterProp: newFilterProp,
      filteredGoals,
      filterLabel,
    });
  }
  updateFilterProp(filterProp, tabIndex, filter) {
    filter = filter || this.state.tabs.getIn([tabIndex, 'filter']);
    const { users, milestones, me } = this.props;

    return filterProp.map((p) => {
      if (typeof p === 'string') {
        return p;
      }
      let newString;

      if (p.get('id') === 'goalType') {
        newString = getGoalTypeForValue(filter.get('goalType'));
      } else if (p.get('id') === 'user') {
        const userId = filter.get('user') === 'me' ? me.get('id') : filter.get('user');
        newString = getUserStringForValue(users, userId);
      } else if (p.get('id') === 'milestone') {
        return p.set('string', getMilestoneStringForValue(milestones, filter.get('milestone')));
      }
      if (newString !== p.get('string')) {
        return p.set('string', newString);
      }

      return p;
    });
  }
  updateFilterLabel(filter, filteredGoals) {
    const { users, milestones, me } = this.props;
    return getFilterLabel(filteredGoals.length, filter, users, milestones, me);
  }
  filterGoals(filter) {
    const { goals, me } = this.props;

    const user = filter.get('user') === 'me' ? me.get('id') : filter.get('user');
    const sortedGoals = goals.sort((c, b) => b.get('created_at').localeCompare(c.get('created_at'))).toArray();

    return filterGoals(sortedGoals, filter.get('goalType'), user, filter.get('milestone'));
  }

  tabDidChange(nav, index) {
    const { tabIndex, filterProp, tabs } = this.state;
    if (tabIndex !== index) {
      const filter = tabs.getIn([index, 'filter']);
      const filteredGoals = this.filterGoals(filter);
      const filterLabel = this.updateFilterLabel(filter, filteredGoals);
      const showFilter = (index === (tabs.size - 1));
      this.setState({
        tabIndex: index,
        filterProp: this.updateFilterProp(filterProp, index),
        filteredGoals,
        filterLabel,
        showFilter,
      });
    }
  }
  onClickGoal(goalId, scrollTop) {
    const {
      navPush,
      goals,
    } = this.props;
    const {
      tabIndex,
    } = this.state;
    const savedState = {
      tabIndex,
      scrollTop,
    }; // state if this gets reopened
    const goal = goals.get(goalId);
    navPush({
      component: 'GoalStep',
      title: goal.get('title'),
      props: {
        goalId,
      },
    },
    savedState);
  }
  render() {
    const { me, savedState } = this.props;
    const {
      tabIndex,
      tabs,
      showFilter,
      filterProp,
      filterLabel,
      filteredGoals,
    } = this.state;
    return (
      <GoalList
        me={me}
        tabIndex={tabIndex}
        savedState={savedState}
        goals={filteredGoals}
        delegate={this}
        tabs={tabs}
        filterProp={filterProp}
        filterLabel={filterLabel}
        showFilter={showFilter}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    goals: state.get('goals'),
    cache: state.getIn(['main', 'cache', 'list-filter']),
    me: state.get('me'),
    users: state.get('users'),
    milestones: state.getIn(['main', 'milestones']),
  };
}


const { func, object } = PropTypes;
HOCGoalList.propTypes = {
  goals: map,
  milestones: map,
  users: map,
  cache: map,
  savedState: object,
  saveCache: func,
  navPush: func,
  delegate: object,
  me: map,
  selectUser: func,
  selectGoalType: func,
  // removeThis: PropTypes.string.isRequired
};

export default connect(mapStateToProps, {
  saveCache: a.main.cache.save,
  selectUser: a.menus.selectUser,
  selectGoalType: a.menus.selectGoalType,
})(HOCGoalList);
