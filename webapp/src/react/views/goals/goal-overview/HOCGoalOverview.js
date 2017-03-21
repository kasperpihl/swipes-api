import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { bindAll, setupCachedCallback, setupLoading } from 'classes/utils';
import GoalsUtil from 'classes/goals-util';
import * as a from 'actions';
import { steps, ways, goals } from 'swipes-core-js';

import TabMenu from 'context-menus/tab-menu/TabMenu';
import GoalOverview from './GoalOverview';

/* global msgGen */

class HOCGoalOverview extends PureComponent {
  static minWidth() {
    return 800;
  }
  static maxWidth() {
    return 900;
  }
  constructor(props) {
    super(props);
    bindAll(this, ['onHandoff', 'onContext']);
    this.state = { tabIndex: 0 };
    setupLoading(this);

    this.clearCB = setupCachedCallback(this.clearLoadingForStep, this);
  }
  componentDidMount() {
    const { goal, navPop } = this.props;
    if (!goal) {
      navPop();
    }
  }
  componentWillReceiveProps(nextProps) {
    const { goal, navPop } = this.props;
    const nextGoal = nextProps.goal;
    if (goal && !nextGoal) {
      navPop();
    }
  }
  onLoadWay(wayId) {

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
  onStepClick(i, e) {
    const { inputMenu, contextMenu, goal, removeStep, renameStep } = this.props;
    const helper = this.getHelper();

    const step = helper.getStepByIndex(i);
    const options = this.getOptionsForE(e);
    const remove = {
      title: 'Remove',
    };
    if (i === helper.getCurrentStepIndex()) {
      remove.disabled = true;
      remove.subtitle = 'Cannot remove current step';
    }
    if (helper.getIsStarted() && helper.getTotalNumberOfSteps() === 1) {
      remove.disabled = true;
      remove.subtitle = 'Cannot remove the last step';
    }

    const items = [{ title: 'Rename' }, remove];

    const delegate = {
      onItemAction: (item) => {
        const clearCB = this.clearLoading.bind(this, step.get('id'));
        if (item.title === 'Rename') {
          inputMenu({
            ...options,
            text: step.get('title'),
            buttonLabel: 'Rename',
          }, (title) => {
            if (title !== step.get('title') && title.length) {
              this.setLoading(step.get('id'), 'Renaming...');
              renameStep(goal.get('id'), step.get('id'), title).then(() => {
                this.clearLoading(step.get('id'));
              });
            }
          });
        } else {
          contextMenu(null);
          this.setLoading(step.get('id'), 'Removing...');
          removeStep(goal.get('id'), step.get('id')).then(() => clearCB());
        }
      },
    };
    contextMenu({
      options,
      component: TabMenu,
      props: {
        delegate,
        items,
      },
    });
  }
  onAssign(i, options) {
    const { selectAssignees, assignStep, goal } = this.props;
    const helper = this.getHelper();
    const step = helper.getStepByIndex(i);

    options.actionLabel = 'Reassign';
    if (step.get('id') === helper.getCurrentStepId()) {
      options.actionLabel = 'Reassign and write message';
    }
    let overrideAssignees;
    selectAssignees(options, step.get('assignees').toJS(), (newAssignees) => {
      if (newAssignees) {
        overrideAssignees = newAssignees;
      } else if (overrideAssignees) {
        if (i === helper.getCurrentStepIndex()) {
          this.onHandoff(helper.getCurrentStepId(), 'Handoff', overrideAssignees);
        } else {
          const clearCB = this.clearLoading.bind(null, step.get('id'));
          this.setLoading(step.get('id'), 'Assigning...');
          assignStep(goal.get('id'), step.get('id'), overrideAssignees).then(() => clearCB());
        }
      }
    });
  }

  onStepCheck(i, e) {
    const helper = this.getHelper();
    // const currentI = helper.getCurrentStepIndex();
    const step = helper.getStepByIndex(i);
    const _target = (step && step.get('id')) || '_complete';
    this.onHandoff(_target, 'Handoff');
    e.stopPropagation();
  }
  onStart(e) {
    const helper = this.getHelper();
    let step = helper.getNextStep();
    let assignees;
    let target = '_complete';
    if (!helper.getIsStarted()) {
      const options = this.getOptionsForE(e);
      const { confirm } = this.props;

      if (!helper.getTotalNumberOfSteps()) {
        confirm(Object.assign({}, options, {
          title: 'Add steps first',
          actions: [{ text: 'Got it' }],
          message: 'Before starting a goal, you have to add steps to it. You can do it manually or load a way below.',
        }));
        return;
      }
      step = helper.getStepByIndex(0);
    }
    if (step) {
      assignees = step.get('assignees');
      target = step.get('id');
    }

    this.onHandoff(target, '', assignees);
  }

  onHandoff(_target, title, assignees) {
    const { openSecondary, goal } = this.props;
    openSecondary({
      id: 'GoalHandoff',
      title,
      props: {
        _target,
        assignees,
        goalId: goal.get('id'),
      },
    });
  }

  onNotify(target, title, e) {
    const helper = this.getHelper();
    const { contextMenu, me, selectAssignees } = this.props;
    const options = {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
    const all = helper.getAllInvolvedAssignees().filter(uId => uId !== me.get('id'));
    const inStep = helper.getCurrentAssignees()
                          .filter(uId => uId !== me.get('id'));
    const prevStep = helper.getAssigneesForStepIndex(helper.getNumberOfCompletedSteps() - 1)
                          .filter(uId => uId !== me.get('id'));
    const items = [];
    if (all.size) {
      items.push({
        title: 'Everyone in goal',
        assignees: all,
        subtitle: msgGen.getUserArrayString(all, { number: 4 }),
      });
    }
    if (prevStep.size) {
      items.push({
        title: 'Previous assignees',
        assignees: prevStep,
        subtitle: msgGen.getUserArrayString(prevStep, { number: 4 }),
      });
    }
    if (inStep.size) {
      items.push({
        title: 'Current assignees',
        assignees: inStep,
        subtitle: msgGen.getUserArrayString(inStep, { number: 4 }),
      });
    }
    items.push({ title: 'Yourself', assignees: [me.get('id')] });
    items.push({ title: 'Choose people' });
    const delegate = {
      onItemAction: (item) => {
        contextMenu(null);
        if (!item.assignees) {
          let overrideAssignees;
          options.actionLabel = 'Notify and write message';
          selectAssignees(options, [], (newAssignees) => {
            if (newAssignees) {
              overrideAssignees = newAssignees;
            } else if (overrideAssignees && overrideAssignees.length) {
              this.onHandoff(target, title, overrideAssignees);
            }
          });
        } else {
          this.onHandoff(target, title, item.assignees);
        }
      },
    };

    contextMenu({
      options,
      component: TabMenu,
      props: {
        delegate,
        items,
      },
    });

    //
  }

  onContext(e) {
    const {
      goal,
      archive,
      contextMenu,
      createWay,
      confirm,
      inputMenu,
    } = this.props;
    const options = this.getOptionsForE(e);
    const delegate = {
      onItemAction: (item) => {
        if (item.id === '_complete') {
          this.onHandoff(item.id, 'Handoff');
          contextMenu(null);
        } else if (item.id === 'way') {
          inputMenu(Object.assign({}, options, {
            initialValue: goal.get('title'),
            placeholder: 'Name your Way: Like Development, Design etc.',
            buttonLabel: 'Save',
          }), (title) => {
            this.setLoading('dots');
            const helper = this.getHelper();
            createWay(title, helper.getObjectForWay()).then((res) => {
              if (res && res.ok) {
                this.clearLoading('dots', 'Added way');
              } else {
                this.clearLoading('dots', '!Something went wrong');
              }
            });
          });
        } else {
          confirm(Object.assign({}, options, {
            title: 'Archive goal',
            message: 'This will make this goal inactive for all participants.',
          }), (i) => {
            if (i === 1) {
              this.setLoading('dots');
              archive(goal.get('id')).then((res) => {
                if (!res || !res.ok) {
                  this.clearLoading('dots', '!Something went wrong');
                }
              });
            }
          });
        }
      },
    };
    contextMenu({
      options,
      component: TabMenu,
      props: {
        items: [
          { id: '_complete', title: 'Complete goal' },
          { id: 'way', title: 'Save as a Way' },
          { title: 'Archive Goal' },
        ],
        delegate,
      },
    });
  }
  onAddStep(title, e) {
    const { addStep, goal } = this.props;
    this.setLoading('add', 'Adding...');
    addStep(goal.get('id'), title).then(() => this.clearLoading('add'));
  }
  getOptionsForE(e) {
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
  clickedAssign(i, e) {
    e.stopPropagation();
    const options = this.getOptionsForE(e);
    this.onAssign(i, options);
  }
  render() {
    const { goal, me } = this.props;
    const { tabIndex } = this.state;

    return (
      <GoalOverview
        goal={goal}
        myId={me.get('id')}
        tabIndex={tabIndex}
        delegate={this}
        loadingState={this.getAllLoading()}
      />
    );
  }
}

const { func } = PropTypes;

HOCGoalOverview.propTypes = {
  goal: map,
  addStep: func,
  confirm: func,
  me: map,
  navPop: func,
  inputMenu: func,
  archive: func,
  createWay: func,
  selectAssignees: func,
  openSecondary: func,
  renameGoal: func,
  assignStep: func,
  renameStep: func,
  removeStep: func,
  contextMenu: func,
};

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  createWay: ways.create,
  archive: goals.archive,
  contextMenu: a.main.contextMenu,
  addStep: steps.add,
  renameGoal: goals.rename,
  removeStep: steps.remove,
  renameStep: steps.rename,
  assignStep: steps.assign,
  selectAssignees: a.goals.selectAssignees,
  confirm: a.menus.confirm,
  inputMenu: a.menus.input,
})(HOCGoalOverview);
