import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import { bindAll, setupCachedCallback, setupLoadingHandlers } from 'classes/utils';
import GoalsUtil from 'classes/goals-util';
import * as a from 'actions';
import { steps, ways } from 'swipes-core-js';
import Section from 'components/section/Section';
import SWView from 'SWView';
import Button from 'Button';
import HOCAttachments from 'components/attachments/HOCAttachments';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import TabMenu from 'context-menus/tab-menu/TabMenu';
import HOCHistory from './HOCHistory';
import GoalSide from './GoalSide';
import './styles/goal-overview.scss';
/* global msgGen */

class HOCGoalOverview extends PureComponent {
  static minWidth() {
    return 650;
  }
  static maxWidth() {
    return 900;
  }
  constructor(props) {
    super(props);
    bindAll(this, ['onHandoff', 'onContext']);
    this.state = {
      loadingSteps: fromJS({}),
    };

    setupLoadingHandlers(this);

    this.clearCB = setupCachedCallback(this.clearLoadingForStep, this);
    this.onNotify = setupCachedCallback(this.onNotify, this);
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
  onTitleClick(e) {
    const options = this.getOptionsForE(e);
    const { goal, renameGoal, inputMenu } = this.props;
    inputMenu({
      ...options,
      text: goal.get('title'),
      buttonLabel: 'Rename',
    }, (title) => {
      if (title !== goal.get('title') && title.length) {
        this.setLoadingState('title', 'Renaming...');
        renameGoal(goal.get('id'), title).then(() => {
          this.clearLoadingState('title');
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
    if (helper.getTotalNumberOfSteps() === 1) {
      remove.disabled = true;
      remove.subtitle = 'Cannot remove the last step';
    }

    const items = [{ title: 'Reassign' }, { title: 'Rename' }, remove];
    const delegate = {
      onItemAction: (item) => {
        if (item.title === 'Reassign') {
          this.onAssign(i, options);
        } else if (item.title === 'Rename') {
          inputMenu({
            ...options,
            text: step.get('title'),
            buttonLabel: 'Rename',
          }, (title) => {
            if (title !== step.get('title') && title.length) {
              this.setStepLoading(step.get('id'), 'Renaming...');
              renameStep(goal.get('id'), step.get('id'), title).then(this.clearCB(step.get('id')));
            }
          });
        } else {
          contextMenu(null);
          this.setStepLoading(step.get('id'), 'Removing...');
          removeStep(goal.get('id'), step.get('id')).then(this.clearCB(step.get('id')));
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
          this.setStepLoading(step.get('id'), 'Assigning...');
          assignStep(goal.get('id'), step.get('id'), overrideAssignees).then(this.clearCB(step.get('id')));
        }
      }
    });
  }

  onStepCheck(i, e) {
    const helper = this.getHelper();
    const currentI = helper.getCurrentStepIndex();
    if (i >= currentI) {
      i += 1;
    }
    const step = helper.getStepByIndex(i);
    const _target = (step && step.get('id')) || '_complete';
    this.onHandoff(_target, 'Handoff');
    e.stopPropagation();
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
        if (item.id === 'way') {
          inputMenu(Object.assign({}, options, {
            initialValue: goal.get('title'),
            placeholder: 'Name your Way: Like Development, Design etc.',
            buttonLabel: 'Save',
          }), (title) => {
            this.setLoadingState('dots');
            const helper = this.getHelper();
            createWay(title, helper.getObjectForWay()).then((res) => {
              if (res && res.ok) {
                this.clearLoadingState('dots', 'Added way');
              } else {
                this.clearLoadingState('dots', '!Something went wrong');
              }
            });
          });
        } else {
          confirm(Object.assign({}, options, {
            title: 'Archive goal',
            message: 'This will make this goal inactive for all participants.',
          }), (i) => {
            if (i === 1) {
              this.setLoadingState('dots');
              archive(goal.get('id')).then((res) => {
                if (!res || !res.ok) {
                  this.clearLoadingState('dots', '!Something went wrong');
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
          { id: 'way', title: 'Save as a Way' },
          { title: 'Archive Goal' },
        ],
        delegate,
      },
    });
  }
  onAddStep(e) {
    const { addStep, inputMenu, goal } = this.props;
    const options = this.getOptionsForE(e);
    inputMenu({
      ...options,
      placeholder: 'Title for the step',
      buttonLabel: 'Add',
    }, (title) => {
      if (title && title.length) {
        this.setStepLoading('add', 'Adding...');
        addStep(goal.get('id'), title).then(this.clearCB('add'));
      }
    });
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
  setStepLoading(id, flag) {
    let { loadingSteps } = this.state;
    loadingSteps = loadingSteps.set(id, flag);
    if (!flag) {
      loadingSteps = loadingSteps.delete(id);
    }
    this.setState({
      loadingSteps,
    });
  }
  clearLoadingForStep(id) {
    this.setStepLoading(id, false);
  }


  renderHeader() {
    const helper = this.getHelper();
    const { goal } = this.props;
    let subtitle;
    if (!helper.getIsStarted()) {
      subtitle = 'Unstarted goal';
    }
    return (
      <div className="add-goal__header">
        <HOCHeaderTitle
          title={this.getLoadingState('title').loadingLabel || goal.get('title')}
          subtitle={subtitle}
          delegate={this}
        >
          <Button
            text="Give Feedback"
            onClick={this.onNotify('_feedback', 'Give Feedback')}
          />
          <Button
            text="Notify"
            onClick={this.onNotify('_notify', 'Notify')}
          />
          <Button
            icon="ThreeDots"
            onClick={this.onContext}
            {...this.getLoadingState('dots')}
          />
        </HOCHeaderTitle>
      </div>
    );
  }
  renderLeft() {
    const { goal } = this.props;

    return (
      <div className="goal-overview__column goal-overview__column--left">
        <Section title="Activity" />
        <HOCHistory goal={goal} />
      </div>
    );
  }
  renderRight() {
    const { goal } = this.props;
    const { loadingSteps } = this.state;
    return (
      <div className="goal-overview__column goal-overview__column--right">
        <GoalSide goal={goal} delegate={this} loadingSteps={loadingSteps} />
        <Section title="Attachments" />
        <HOCAttachments
          attachments={goal.get('attachments')}
          attachmentOrder={goal.get('attachment_order')}
          targetId={goal.get('id')}
          delegate={this}
        />
      </div>
    );
  }
  render() {
    const { goal } = this.props;

    if (!goal) {
      return <div />;
    }

    return (
      <SWView header={this.renderHeader()}>
        <div className="goal-overview">
          {this.renderLeft()}
          {this.renderRight()}
        </div>
      </SWView>
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
  archive: a.goals.archive,
  contextMenu: a.main.contextMenu,
  addStep: steps.add,
  renameGoal: a.goals.rename,
  removeStep: steps.remove,
  renameStep: steps.rename,
  assignStep: steps.assign,
  selectAssignees: a.goals.selectAssignees,
  confirm: a.menus.confirm,
  inputMenu: a.menus.input,
})(HOCGoalOverview);
