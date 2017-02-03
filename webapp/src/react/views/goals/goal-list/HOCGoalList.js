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
import ListMenu from 'components/list-menu/ListMenu';
import GoalList from './GoalList';


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
        filter: {
          user: 'any',
          goalType: 'any',
          milestone: 'any',
        },
      }]),
      filterProp: fromJS([
        'Show ',
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

    const { tabIndex, filterProp } = this.state;
    const filter = this.state.tabs.getIn([tabIndex, 'filter']);
    this.state.filterProp = this.updateFilterProp(filterProp, tabIndex);
    this.state.filteredGoals = this.filterGoals(filter);

    this.state.filterLabel = this.updateFilterLabel(filter, this.state.filteredGoals);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
  }
  onChangeFilter(obj, e) {
    const { contextMenu } = this.props;

    const options = {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'center',
    };

    const updateState = (type, value) => {
      const { tabs, tabIndex, filterProp } = this.state;
      const newTabs = tabs.setIn([tabIndex, 'filter', type], value);
      const newFilter = newTabs.getIn([tabIndex, 'filter']);
      const newFilterProp = this.updateFilterProp(filterProp, tabIndex, newFilter);
      const filteredGoals = this.filterGoals(newFilter);
      const filterLabel = this.updateFilterLabel(newFilter, filteredGoals);
      this.setState({
        tabs: newTabs,
        filterProp: newFilterProp,
        filteredGoals,
        filterLabel,
      });
    };
    function gtcb(value) {
      updateState(obj.id, value);
      contextMenu(null);
    }
    if (obj.id === 'goalType') {
      contextMenu({
        options,
        component: ListMenu,
        props: {
          items: [
            { title: 'Any goals', onClick: gtcb.bind(this, 'any') },
            { title: 'Completed goals', onClick: gtcb.bind(this, 'completed') },
            { title: 'Current goals', onClick: gtcb.bind(this, 'current') },
            { title: 'Upcoming goals', onClick: gtcb.bind(this, 'upcoming') },
          ],
        },
      });
    }
    if (obj.id === 'user') {
      const { selectUser } = this.props;
      selectUser(options, (res) => {
        console.log('res', res);
        updateState(obj.id, res.id);
      });
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

  checkIfUpdateFilter() {
    const { filterProp } = this.state;
    const newFilterProp = this.updateFilterProp(filterProp);
    if (newFilterProp !== filterProp) {
      return newFilterProp;
    }
    return undefined;
  }
  tabDidChange(nav, index) {
    const { tabIndex, filterProp, tabs } = this.state;
    if (tabIndex !== index) {
      const filter = tabs.getIn([index, 'filter']);
      const filteredGoals = this.filterGoals(filter);
      const filterLabel = this.updateFilterLabel(filter, filteredGoals);
      this.setState({
        tabIndex: index,
        filterProp: this.updateFilterProp(filterProp, index),
        filteredGoals,
        filterLabel,
      });
    }
  }
  goalListClickedGoal(goalId, scrollTop) {
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
    const { goals, me, savedState } = this.props;
    const {
      tabIndex,
      tabs,
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
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    goals: state.get('goals'),
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
  savedState: object,
  navPush: func,
  delegate: object,
  me: map,
  contextMenu: func,
  // removeThis: PropTypes.string.isRequired
};

export default connect(mapStateToProps, {
  contextMenu: a.main.contextMenu,
  selectUser: a.menus.selectUser,
})(HOCGoalList);
