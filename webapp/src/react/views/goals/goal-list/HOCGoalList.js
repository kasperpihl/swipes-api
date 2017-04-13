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
    this.callDelegate = setupDelegate(props.delegate);
    this.state = {
      tabs: ['current', 'upcoming', 'unassigned', 'default'],
      tabIndex: 0,
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
  onAssignClick(goalId, e) {

    const { goals, selectAssignees } = this.props;
    const helper = this.getHelper();
    const stepId = helper.getCurrentStepId();
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
        console.log('lets do this!');
      }
    });
  }
  onScroll(e) {
    this._scrollTop = e.target.scrollTop;
  }
  onGoalClick(goalId) {
    const { navPush } = this.props;

    this.saveState();
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
      selectMilestone(options, res => this.updateFilter({ goalType: res.id }));
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
    const { me, savedState, filters, goals, pinnedGoals: pG } = this.props;
    const {
      tabIndex,
      tabs,
      showFilter,
      filterProp,
    } = this.state;
    let goalFilter = filters.get(tabs[tabIndex]);
    let pinsFound = Set();
    goalFilter = goalFilter.set('goals', goalFilter.get('goals').sort((g1, g2) => {
      const g1PinI = pG.indexOf(g1);
      const g2PinI = pG.indexOf(g2);
      pinsFound = pinsFound.add(g1PinI);
      pinsFound = pinsFound.add(g2PinI);
      if(g1PinI > g2PinI){
        return -1;
      }
      if(g2PinI > g1PinI){
        return 1;
      }
      return goals.getIn([g2, 'created_at']).localeCompare(goals.getIn([g1, 'created_at']))
    }));
    pinsFound = pinsFound.delete(-1);

    return (
      <GoalList
        goalFilter={goalFilter}
        numberOfPins={pinsFound.size}
        tabIndex={tabIndex}
        savedState={savedState}
        loadingState={this.getAllLoading()}
        delegate={this}
        tabs={tabs.map((tId, i) => {
          let title = filters.getIn([tId, 'title'])
          const size = filters.getIn([tId, 'goals']).size;
          if(i < (tabs.length - 1) && size){
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
    pinnedGoals: state.getIn(['me', 'settings', 'pinned_goals']),
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
  clearFilter: ca.filters.clear,
  updateFilter: ca.filters.update,
  inputMenu: a.menus.input,
  selectGoalType: a.menus.selectGoalType,
  selectAssignees: a.goals.selectAssignees,
})(HOCGoalList);
