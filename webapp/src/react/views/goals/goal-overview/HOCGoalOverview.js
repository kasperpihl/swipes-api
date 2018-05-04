import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import propsOrPop from 'swipes-core-js/utils/react/propsOrPop';
import { fromJS, List, Map } from 'immutable';
import { bindAll, setupLoading } from 'swipes-core-js/classes/utils';
import { setupCachedCallback } from 'react-delegate';
import dayStringForDate from 'swipes-core-js/utils/time/dayStringForDate';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import getNewOrderFromResult from 'swipes-core-js/utils/getNewOrderFromResult';

import * as mainActions from 'src/redux/main/mainActions';
import * as menuActions from 'src/redux/menu/menuActions';
import * as goalActions from 'src/redux/goal/goalActions';
import * as wayActions from 'src/redux/way/wayActions';

import * as ca from 'swipes-core-js/actions';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import TabMenu from 'src/react/context-menus/tab-menu/TabMenu';
import GoalOverview from './GoalOverview';

/* global msgGen */

class HOCGoalOverview extends PureComponent {
  static sizes() {
    return [825, 930];
  }
  static fullscreen() {
    return false;
  }
  constructor(props) {
    super(props);
    propsOrPop(this, 'goal');
    this.state = {
      showLine: false,
    };
    setupLoading(this);

    this.clearCB = setupCachedCallback(this.clearLoadingForStep, this);
  }
  componentWillUnmount() {
    this._unmounted = true;
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
  onIncompleteGoal() {
    const { incompleteGoal, completeGoal, successGradient } = this.props;
    const helper = this.getHelper();
    this.setLoading('completing', 'Incompleting goal...');
    incompleteGoal(helper.getId()).then((res) => {
      if (res && res.ok) {
        this.clearLoading('completing');
      } else {
        this.clearLoading('completing', '!Something went wrong');
      }
    });
  }
  onCompleteGoal() {
    const { completeGoal, successGradient, goal } = this.props;
    this.setLoading('completing', 'Completing goal...');
    completeGoal(goal.get('id')).then((res) => {
      if (res && res.ok) {
        successGradient();
        this.clearLoading('completing');
      } else {
        this.clearLoading('completing', '!Something went wrong');
      }
    });
  }

  onArchive(options) {
    const { goal, confirm, archive } = this.props;
    confirm(Object.assign({}, options, {
      title: 'Delete goal',
      message: 'This will delete the goal permanently and cannot be undone.',
    }), (i) => {
      if (i === 1) {
        this.setLoading('dots');
        archive(goal.get('id')).then((res) => {
          if (res.ok) {
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
      if (milestoneRes.id === 'none' && goal.get('milestone_id')) {
        funcToCall = removeGoalFromMilestone;
        action = 'removed';
      } else if (milestoneRes.id !== 'none' && milestoneRes.id !== goal.get('milestone_id')) {
        funcToCall = addGoalToMilestone;
        milestoneId = milestoneRes.id;
      }
      if (funcToCall) {
        this.setLoading('dots');
        funcToCall(milestoneId, goal.get('id')).then((res) => {
          if (res.ok) {
            this.clearLoading('dots', `Plan ${action}`, 3000);
            window.analytics.sendEvent(`Plan ${action}`, {});
          } else {
            this.clearLoading('dots', '!Something went wrong', 3000);
          }
        });
      }
    });
  }
  onSaveWay(options) {
    const { createWay, inputMenu } = this.props;
    const helper = this.getHelper();
    inputMenu({
      ...options,
      placeholder: 'What should we call the way?',
      buttonLabel: 'Save',
    }, (title) => {
      if (title && title.length) {
        this.setLoading('dots');
        createWay(title, helper.getObjectForWay()).then((res) => {
          if (res.ok) {
            this.clearLoading('dots', 'Saved way', 3000);
          } else {
            this.clearLoading('dots', '!Something went wrong', 3000);
          }
        });
      }
    });
  }
  onLoadWay(options) {
    const { loadWay, goalLoadWay } = this.props;
    const helper = this.getHelper();
    loadWay(options, (way) => {
      if (way) {
        this.setLoading('dots');
        goalLoadWay(helper.getId(), way.get('id')).then((res) => {
          if (res.ok) {
            this.clearLoading('dots', 'Loaded way', 3000);
          } else {
            this.clearLoading('dots', '!Something went wrong', 3000);
          }
        });
      }
    });
  }
  onAddedAttachment(att, clearLoading) {
    const { goal, addAttachment } = this.props;
    addAttachment(goal.get('id'), att.get('link').toJS(), att.get('title')).then((res) => {
      clearLoading();
      if (res.ok) {
        window.analytics.sendEvent('Attachment added', {
          Type: att.getIn(['link', 'service', 'type']),
          Service: 'swipes',
        });
      }
    });
    return false;
  }
  onAssign(i, e) {
    const options = this.getOptionsForE(e);
    const { selectAssignees, assignGoal, goal } = this.props;

    let overrideAssignees;
    options.onClose = () => {
      if (overrideAssignees) {
        assignGoal(goal.get('id'), overrideAssignees).then((res) => {
          if (res.ok) {
           window.analytics.sendEvent('Goal assigned', {
              'Number of assignees': overrideAssignees.length,
            });
         }
        });
      }
    };
    selectAssignees(options, goal.get('assignees').toJS(), (newAssignees) => {
      if (newAssignees) {
        overrideAssignees = newAssignees;
      }
    });
    e.stopPropagation();
  }
  onInfoTabAction(i, options, e) {
    const items = ['onLoadWay', 'onSaveWay', 'onArchive'];
    this[items[i]](options);
  }
  onInfoTabInfo(i, options, e) {
    this.onEditMilestone(options);
  }
  onDragStart() {
    document.body.classList.add("no-select");
  }

  onDragEnd = (result) => {
    document.body.classList.remove("no-select");
    if (!result.destination) {
      return;
    }
    const order = this.state.tempStepOrder || this.props.goal.get('step_order');
    const tempStepOrder = getNewOrderFromResult(order, result);
    this.setState({ tempStepOrder });
    this.onNextReorder(tempStepOrder.toJS());
  }
  onNextReorder(order) {
    const { stepReorder, goal } = this.props;

    this.nextOrder = order;
    if(this.isReordering) return;

    this.nextOrder = null;
    this.isReordering = true;

    stepReorder(goal.get('id'), order).then((res) => {
      this.isReordering = false;
      if(!res.ok || !this.nextOrder) {
        !this._unmounted && this.setState({ tempStepOrder: null });
      } else if(this.nextOrder) {
        this.onNextReorder(this.nextOrder);
      }
    });
  }
  viewDidLoad(stepList) {
    this.stepList = stepList;
  }
  getInfoTabProps() {
    const { goal } = this.props;

    const createdLbl = `${dayStringForDate(goal.get('created_at'))} by ${msgGen.users.getFullName(goal.get('created_by'))}`;
    const mileLbl = msgGen.milestones.getName(goal.get('milestone_id'));
    const mileIcon = goal.get('milestone_id') ? 'MiniMilestone' : 'MiniNoMilestone';
    const mileAct = goal.get('milestone_id') ? 'edit' : 'add';
    return {
      actions: [
        { title: 'Load a way', icon: 'Download' },
        { title: 'Save as a way', icon: 'Save' },
        { title: 'Delete goal', icon: 'Delete', danger: true },
      ],
      info: [
        { title: 'Plan', text: mileLbl, icon: mileIcon, actionLabel: mileAct },
        { title: 'Created', text: createdLbl },
      ],
      about: {
        title: 'What is a goal',
        text: 'A Goal is where work happens. Something needs to be done or delivered. Goals can be broken down into steps to show the next action.\n\nAll important links, documents, and notes can be attached to the goal so everyone is on the same page. You can discuss a goal or post an update via "Discuss".',
      },
    };
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

  render() {
    const { goal, me, viewWidth } = this.props;
    const { tempStepOrder } = this.state;

    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}>
        <GoalOverview
          goal={goal}
          myId={me.get('id')}
          delegate={this}
          viewWidth={viewWidth}
          tempStepOrder={tempStepOrder}
          {...this.bindLoading()}
        />
      </DragDropContext>
    );
  }
}

export default connect((state, props) => ({
  goal: state.getIn(['goals', props.goalId]),
  me: state.get('me'),
}), {
  addAttachment: ca.attachments.add,
  archive: ca.goals.archive,
  contextMenu: mainActions.contextMenu,
  assignGoal: ca.goals.assign,
  renameGoal: ca.goals.rename,
  completeGoal: ca.goals.complete,
  incompleteGoal: ca.goals.incomplete,
  loadWay: wayActions.load,
  goalLoadWay: ca.goals.loadWay,
  createWay: ca.ways.create,
  selectAssignees: goalActions.selectAssignees,
  selectMilestone: menuActions.selectMilestone,
  stepReorder: ca.steps.reorder,
  addGoalToMilestone: ca.milestones.addGoal,
  removeGoalFromMilestone: ca.milestones.removeGoal,
  successGradient: mainActions.successGradient,
  confirm: menuActions.confirm,
  inputMenu: menuActions.input,
})(navWrapper(HOCGoalOverview));
