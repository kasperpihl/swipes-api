import React, { PureComponent, PropTypes } from 'react';
import * as a from 'actions';
import { cache, goals as goa } from 'swipes-core-js/actions';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { map } from 'react-immutable-proptypes';
import { setupDelegate, bindAll, setupLoading } from 'swipes-core-js/classes/utils';
import filterGoals from 'classes/filter-util';
import SWView from 'SWView';
import TabBar from 'components/tab-bar/TabBar';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import Button from 'Button';
import {
  EditorState,
  convertToRaw,
} from 'draft-js';

import GoalList from './GoalList';


/* global msgGen*/
const defaultFilter = fromJS({
  user: 'any',
  goalType: 'all',
  milestone: 'any',
  matching: null,
});

class HOCGoalList extends PureComponent {
  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.delegate);
    this.state = {
      tabs: ['current', 'upcoming', 'unassigned', 'default'],
      tabIndex: 0,
      tabs: fromJS([{
        title: 'My current',
        filter: {
          userId: 'me',
          goalType: 'current',
        },
      }, {
        title: 'Next',
        filter: {
          userId: 'me',
          goalType: 'upcoming',
        },
      }, {
        title: 'Unassigned',
        filter: {
          goalType: 'current',
          userId: 'none',
        },
      }, {
        title: 'Filter',
        filter: defaultFilter,
      }]),
      showFilter: false,
      filterProp: fromJS([
        { id: 'goalType' },
        ' assigned to ',
        { id: 'userId' },
        ' matching ',
        { id: 'matching' },
      ]),
    };
    setupLoading(this);
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

    bindAll(this, ['onAddGoal', 'onScroll']);
  }

  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.goals !== this.props.goals) {
      this.updateFilter({});
    }
  }
  onAssignClick(goalId, stepId, e) {
    const { goals, selectAssignees, openSecondary } = this.props;
    const step = goals.getIn([goalId, 'steps', stepId]);
    e.stopPropagation();
    const options = this.getOptionsForE(e);
    options.actionLabel = 'Reassign and write message';
    let overrideAssignees;
    const title = 'Handoff';
    selectAssignees(options, step.get('assignees').toJS(), (newAssignees) => {
      if (newAssignees) {
        overrideAssignees = newAssignees;
      } else if (overrideAssignees) {
        openSecondary({
          id: 'GoalHandoff',
          title,
          props: {
            title,
            _target: stepId,
            assignees: overrideAssignees,
            goalId,
          },
        });
      }
    });
  }
  onScroll(e) {
    this._scrollTop = e.target.scrollTop;
  }
  onClickGoal(goalId) {
    const {
      navPush,
      goals,
    } = this.props;

    const goal = goals.get(goalId);
    this.saveState();
    navPush({
      id: 'GoalOverview',
      title: goal.get('title'),
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
    if (obj.id === 'userId') {
      const { selectUser } = this.props;
      selectUser(options, res => this.updateFilter({ userId: res.id }));
    }
    if (obj.id === 'milestone') {
      const { selectMilestone } = this.props;
      selectMilestone(options, res => this.updateFilter({ goalType: res.id }));
    }
    if (obj.id === 'matching') {
      const { inputMenu } = this.props;
      const { tabs, tabIndex } = this.state;
      inputMenu({
        ...options,
        buttonLabel: 'Search',
        placeholder: 'Search goal and step titles',
        allowEmpty: true,
        text: tabs.getIn([tabIndex, 'filter', 'matching']),
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
        this.tabDidChange(2);
        createGoal(title, convertToRaw(EditorState.createEmpty().getCurrentContent())).then((res) => {
          if (res && res.ok) {
            this.clearLoading('add');
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

    return filterProp.map((p) => {
      if (typeof p === 'string') {
        return p;
      }
      let newString;

      if (p.get('id') === 'goalType') {
        newString = msgGen.goals.getType(filter.get('goalType'));
      } else if (p.get('id') === 'userId') {
        newString = msgGen.users.getName(filter.get('userId'));
      } else if (p.get('id') === 'milestone') {
        return p.set('string', msgGen.milestones.getName(filter.get('milestone')));
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
    });
  }
  updateFilterLabel(filter, filteredGoals) {
    return msgGen.goals.getFilterLabel(filteredGoals.length, filter);
  }
  filterGoals(filter) {
    const { goals, me } = this.props;

    const user = filter.get('userId') === 'me' ? me.get('id') : filter.get('userId');
    const sortedGoals = goals.sort((c, b) => b.get('created_at').localeCompare(c.get('created_at'))).toArray();

    return filterGoals(sortedGoals, filter.get('goalType'), user, filter.get('milestone'), filter.get('matching'));
  }

  tabDidChange(index) {
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
    } else if (index === (tabs.size - 1)) {
      if (!this.state.showFilter) {
        this.setState({ showFilter: true });
      }
    }
  }
  renderHeader() {
    return (
      <div className="goals-list__header">
        <HOCHeaderTitle title="Team goals">
          <Button
            text="Add a goal"
            primary
            {...this.getLoading('add')}
            onClick={this.onAddGoal}
          />
        </HOCHeaderTitle>
        {this.renderTabbar()}
      </div>
    );
  }
  renderTabbar() {
    const {
      tabIndex,
      tabs,
    } = this.state;

    return (
      <div className="goals-list__tab-bar" key="tabbar">
        <TabBar tabs={tabs.map(t => t.get('title')).toArray()} delegate={this} activeTab={tabIndex} />
      </div>
    );
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
    const initialScroll = (savedState && savedState.get('scrollTop')) || 0;

    return (
      <SWView
        header={this.renderHeader()}
        onScroll={this.onScroll}
        initialScroll={initialScroll}
      >
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
          addGoal={this.onAddGoal}
        />
      </SWView>
    );
  }
}

function mapStateToProps(state) {
  return {
    goals: state.get('goals'),
    cache: state.getIn(['cache', 'list-filter']),
    me: state.get('me'),
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
  me: map,
  selectUser: func,
  selectAssignees: func,
  selectGoalType: func,
  selectMilestone: func,
  // removeThis: PropTypes.string.isRequired
};

export default connect(mapStateToProps, {
  saveCache: cache.save,
  createGoal: goa.create,
  selectUser: a.menus.selectUser,
  inputMenu: a.menus.input,
  selectGoalType: a.menus.selectGoalType,
  selectAssignees: a.goals.selectAssignees,
})(HOCGoalList);
