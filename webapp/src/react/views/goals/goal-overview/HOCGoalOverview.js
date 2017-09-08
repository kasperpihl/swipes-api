import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { propsOrPop } from 'swipes-core-js/classes/react-utils';
import { fromJS, List, Map } from 'immutable';
import { bindAll, setupCachedCallback, setupLoading } from 'swipes-core-js/classes/utils';
import { dayStringForDate } from 'swipes-core-js/classes/time-utils';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
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
  static fullscreen() {
    return false;
  }
  constructor(props) {
    super(props);
    propsOrPop(this, 'goal');
    this.state = {
      showLine: false,
      editMode: false,
      handoff: null,
      emptyStateOpacity: 1,
    };
    setupLoading(this);

    this.clearCB = setupCachedCallback(this.clearLoadingForStep, this);
  }
  onScroll(e) {
    const { showLine } = this.state;
    const newShowLine = e.target.scrollTop > 0;

    if (showLine !== newShowLine) {
      this.setState({ showLine: newShowLine });
    }
  }
  onEditSteps() {
    this.setState({ editMode: !this.state.editMode });
  }
  onCreatePost(props) {
    const { goal, openModal } = this.props;
    props = props || {};
    props.context = {
      id: goal.get('id'),
      title: goal.get('title'),
    };

    openModal({
      id: 'CreatePost',
      title: 'Create Post',
      props,
    });
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
  onGoalCheckboxClick() {
    const { incompleteGoal, completeGoal, successGradient } = this.props;
    const helper = this.getHelper();
    const actionFunc = helper.getIsCompleted() ? incompleteGoal : completeGoal;
    this.setLoading('completing');
    actionFunc(helper.getId()).then((res) => {
      if (res && res.ok) {
        if (!helper.getIsCompleted()) {
          successGradient();
        }
        this.setState({
          handoff: {
            completed: !helper.getIsCompleted(),
          },
        });
        this.clearLoading('completing');
      } else {
        this.clearLoading('completing', '!Something went wrong');
      }
    });
  }

  onHandoffMessage(handoff) {
    const helper = this.getHelper();
    const assignees = helper.getAllAssigneesButMe();

    console.log(i, handoff);
    this.onCreatePost({
      taggedUsers: assignees.toArray(),
    });
  }

  onStepDidComplete(handoff) {
    const { successGradient } = this.props;
    if (handoff.completed) {
      successGradient();
    }
    this.clearLoading('completing');
    this.setState({ handoff });
  }
  onCloseHandoff() {
    this.setState({ handoff: null });
  }
  onHandoff() {
    const { handoff } = this.state;
    const { me } = this.props;

    if (handoff) {
      const helper = this.getHelper();
      const taggedUsers = helper.getAllAssigneesButMe();

      this.onCreatePost({
        taggedUsers: taggedUsers.toArray(),
      });
      this.setState({ handoff: null });
    }
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
            this.clearLoading('dots', `Milestone ${action}`, 3000);
            window.analytics.sendEvent(`Milestone ${action}`, {});
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
  onAddStepItemInputChange(title) {
    const { emptyStateOpacity } = this.state;
    const newEmptyStateOpacity = Math.max((10 - title.length) / 10, 0);

    if (emptyStateOpacity !== newEmptyStateOpacity) {
      this.setState({ emptyStateOpacity: newEmptyStateOpacity });
    }
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
        { title: 'Milestone', text: mileLbl, icon: mileIcon, actionLabel: mileAct },
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
    const { goal, me } = this.props;
    const { editMode, handoff, showLine, emptyStateOpacity } = this.state;

    return (
      <GoalOverview
        goal={goal}
        editMode={editMode}
        handoff={handoff}
        myId={me.get('id')}
        delegate={this}
        showLine={showLine}
        emptyStateOpacity={emptyStateOpacity}
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
  assignGoal: ca.goals.assign,
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
  successGradient: a.main.successGradient,
  confirm: a.menus.confirm,
  inputMenu: a.menus.input,
  preview: a.links.preview,
  browser: a.main.browser,
})(navWrapper(HOCGoalOverview));
