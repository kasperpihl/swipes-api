import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { propsOrPop } from 'classes/react-utils';
import { fromJS, List, Map } from 'immutable';
import { bindAll, setupCachedCallback, setupLoading } from 'swipes-core-js/classes/utils';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';

import TabMenu from 'context-menus/tab-menu/TabMenu';
import GoalOverview from './GoalOverview';

/* global msgGen */

class HOCGoalOverview extends PureComponent {
  static minWidth() {
    return 840;
  }
  static maxWidth() {
    return 900;
  }
  constructor(props) {
    super(props);
    bindAll(this, ['onContext']);
    propsOrPop(this, 'goal');
    this.state = {
      tabIndex: 0,
      editMode: false,
      handoff: null,
    };
    setupLoading(this);

    this.clearCB = setupCachedCallback(this.clearLoadingForStep, this);
  }
  onEditSteps() {
    this.setState({ editMode: !this.state.editMode });
  }
  onSeeAll() {
    const { openSecondary, goal, contextMenu } = this.props;
    contextMenu();
    openSecondary({
      id: 'ActivityFeed',
      title: 'ActivityFeed',
      props: {
        goalId: goal.get('id'),
      },
    });
  }
  onClickURL(nI, url) {
    const { browser, target } = this.props;
    browser(target, url);
  }
  onTitleClick(e) {
    const options = this.getOptionsForE(e);
    const { goal, renameGoal, inputMenu } = this.props;
    inputMenu({
      ...options,
      text: goal.get('title'),
      buttonLabel: 'Rename',
    }, (title) => {
      if (title !== goal.get('title') && title.length) {
        this.setLoading('title', 'Renaming...');
        renameGoal(goal.get('id'), title).then(() => {
          this.clearLoading('title');
        });
      }
    });
  }

  onHandoffMessage(handoff) {
    const helper = this.getHelper();
    const assignees = helper.getAllAssignees();

    // console.log(i, handoff);
    this.onOpenNotify(undefined, assignees);
  }

  onStepWillComplete() {
    this.setLoading('completing');
  }
  onStepDidFailComplete() {
    this.clearLoading('completing');
  }
  onStepDidComplete(handoff) {
    this.clearLoading('completing');
    this.setState({ handoff });
  }
  onBarClick() {
    const { incompleteGoal, completeGoal } = this.props;
    const helper = this.getHelper();
    const actionFunc = helper.getIsCompleted() ? incompleteGoal : completeGoal;
    this.setLoading('completing')
    actionFunc(helper.getId()).then((res) => {
      if(res && res.ok) {
        this.clearLoading('completing')
      } else {
        this.clearLoading('completing', '!Something went wrong');
      }
    })
  }
  onCloseHandoff() {
    this.setState({ handoff: null });
  }
  onHandoff() {
    const { handoff } = this.state;
    const { me } = this.props;

    if (handoff) {
      const helper = this.getHelper();
      const assignees = helper.getAllAssignees();

      this.onOpenNotify(fromJS({
        notification_type: 'update',
        assignees: assignees || [me.get('id')],
      }));
      this.setState({ handoff: null });
    }
  }
  onArchive(options) {
    const { goal, confirm, archive } = this.props;
    confirm(Object.assign({}, options, {
      title: 'Archive goal',
      message: 'This will make this goal inactive for all participants.',
    }), (i) => {
      if (i === 1) {
        this.setLoading('dots');
        archive(goal.get('id')).then((res) => {
          if(res.ok){
            window.analytics.sendEvent('Goal archived', {});
          }
          if (!res || !res.ok) {
            this.clearLoading('dots', '!Something went wrong');
          }
        });
      }
    });
  }
  onEditMilestone(options) {
    const { selectMilestone, goal, addGoalToMilestone, removeGoalFromMilestone } = this.props;
    selectMilestone(Object.assign(options, {
      disableAny: true,
      selectedId: goal.get('milestone_id') || 'none',
    }), (milestoneRes) => {
      let funcToCall;
      let action = 'added';
      let milestoneId = goal.get('milestone_id');
      if(milestoneRes.id === 'none' && goal.get('milestone_id')){
        funcToCall = removeGoalFromMilestone;
        action = 'removed';
      } else if(milestoneRes.id !== 'none' && milestoneRes.id !== goal.get('milestone_id')){
        funcToCall = addGoalToMilestone;
        milestoneId = milestoneRes.id;
      }
      if(funcToCall){
        this.setLoading('dots');
        funcToCall(milestoneId, goal.get('id')).then((res) => {
          if(res.ok) {
            this.clearLoading('dots', `Milestone ${action}`, 3000);
            window.analytics.sendEvent(`Milestone ${action}`, {});
          } else {
            this.clearLoading('dots', '!Something went wrong', 3000);
          }
        })
      }
    })
  }
  onSaveWay(options) {
    const { createWay, inputMenu } = this.props;
    const helper = this.getHelper();
    inputMenu({
      ...options,
      placeholder: 'What should we call the way?',
      buttonLabel: 'Save',
    }, (title) => {
      if(title && title.length) {
        this.setLoading('dots');
        createWay(title, helper.getObjectForWay()).then((res) => {
          if(res.ok){
            this.clearLoading('dots', 'Saved way');
          }
          else {
            this.clearLoading('dots', '!Something went wrong');
          }
        });
      }
    })
  }
  onLoadWay(options) {
    const { loadWay, goalLoadWay } = this.props;
    const helper = this.getHelper();
    loadWay(options, (way) => {
      if(way) {
        this.setLoading('dots');
        goalLoadWay(helper.getId(), way.get('id')).then((res) => {
          if(res.ok){
            this.clearLoading('dots', 'Loaded way');
          }
          else {
            this.clearLoading('dots', '!Something went wrong');
          }
        });
      }

    });
  }
  onContext(e) {
    const {
      goal,
      contextMenu,
    } = this.props;
    const options = this.getOptionsForE(e);
    const delegate = {
      onItemAction: (item, i) => this[item.handler](options, item, i),
    };
    const items = [
      { handler: 'onLoadWay', title: 'Load a way'},
      { handler: 'onSaveWay', title: 'Save as a way'},
      { handler: 'onEditMilestone', title: 'Add milestone' },
      { handler: 'onSeeAll', title: 'View activity' },
      { handler: 'onArchive', title: 'Archive Goal' },
    ];
    if(goal.get('milestone_id')){
      items[2].title = 'Edit milestone';
    }
    contextMenu({
      options,
      component: TabMenu,
      props: {
        items,
        delegate,
      },
    });
  }
  viewDidLoad(stepList) {
    this.stepList = stepList;
  }
  getOptionsForE(e) {
    if (e && e.boundingRect) {
      return e;
    }
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
  }
  getHelper() {
    const { goal, me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }
  tabDidChange(index) {
    const { tabIndex } = this.state;
    if (tabIndex !== index) {
      this.setState({ tabIndex: index });
    }
  }
  render() {
    const { goal, me } = this.props;
    const { tabIndex, editMode, handoff } = this.state;

    return (
      <GoalOverview
        goal={goal}
        editMode={editMode}
        handoff={handoff}
        myId={me.get('id')}
        tabIndex={tabIndex}
        delegate={this}
        {...this.bindLoading()}
      />
    );
  }
}

const { func } = PropTypes;

HOCGoalOverview.propTypes = {
  goal: map,
  confirm: func,
  me: map,
  navPop: func,
  inputMenu: func,
  archive: func,
  openSecondary: func,
  renameGoal: func,
  contextMenu: func,
};

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  archive: ca.goals.archive,
  contextMenu: a.main.contextMenu,
  renameGoal: ca.goals.rename,
  completeGoal: ca.goals.complete,
  incompleteGoal: ca.goals.incomplete,
  loadWay: a.ways.load,
  goalLoadWay: ca.goals.loadWay,
  createWay: ca.ways.create,
  selectAssignees: a.goals.selectAssignees,
  selectMilestone: a.menus.selectMilestone,
  addGoalToMilestone: ca.milestones.addGoal,
  removeGoalFromMilestone: ca.milestones.removeGoal,
  confirm: a.menus.confirm,
  inputMenu: a.menus.input,
  preview: a.links.preview,
  browser: a.main.browser,
})(HOCGoalOverview);
