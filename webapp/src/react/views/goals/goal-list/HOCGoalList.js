import React, { Component, PropTypes } from 'react';
import * as a from 'actions';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { map } from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from 'actions';
import { setupDelegate } from 'classes/utils';
import {
  getGoalTypeForValue,
  getUserStringForValue,
  getMilestoneStringForValue,
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
          goalType: 'all',
          milestone: 'any',
        },
      }]),
      filterProp: fromJS([
        'Show ',
        { id: 'goalType' },
        ' related to ',
        { id: 'milestone' },
        ' and assigned to ',
        { id: 'user' },
      ]),
    };
    const { tabIndex, filterProp } = this.state;
    this.state.filterProp = this.updateFilterProp(filterProp, tabIndex);
    if (props.savedState) {
      this.state.tabIndex = props.savedState.get('tabIndex');
    }
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
      const newFilterProp = this.updateFilterProp(filterProp, tabIndex, newTabs.getIn([tabIndex, 'filter']));
      this.setState({
        tabs: newTabs,
        filterProp: newFilterProp,
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
  checkIfUpdateFilter() {
    const { filterProp } = this.state;
    const newFilterProp = this.updateFilterProp(filterProp);
    if (newFilterProp !== filterProp) {
      return newFilterProp;
    }
    return undefined;
  }
  tabDidChange(nav, index) {
    const { tabIndex, filterProp } = this.state;
    if (tabIndex !== index) {
      this.setState({
        tabIndex: index,
        filterProp: this.updateFilterProp(filterProp, index),
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
    const { tabIndex, tabs, filterProp } = this.state;
    return (
      <GoalList
        me={me}
        tabIndex={tabIndex}
        savedState={savedState}
        goals={goals}
        delegate={this}
        tabs={tabs}
        filterProp={filterProp}
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
