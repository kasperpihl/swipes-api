import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupDelegate, setupLoading } from 'swipes-core-js/classes/utils';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import { map } from 'react-immutable-proptypes';
import StepList from './StepList';

class HOCStepList extends PureComponent {
  constructor(props) {
    super(props);
    const helper = this.getHelper();
    this.state = {
      steps: helper.getOrderedSteps(),
    };
    setupLoading(this);
    setupDelegate(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.goal !== this.props.goal) {
      const helper = this.getHelper(nextProps.goal);
      this.setState({ steps: helper.getOrderedSteps() });
    }
  }
  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
  }
  onStepAdd(title) {
    const { addStep, goal } = this.props;
    this.setLoading('add', 'Adding...');
    addStep(goal.get('id'), title).then((res) => {
      this.clearLoading('add');
      if(res.ok){
        window.analytics.sendEvent('Step added', {});
      }
    });
  }
  onStepRemove(i, e) {
    const { confirm, removeStep, goal } = this.props;
    const options = this.getOptionsForE(e);
    const helper = this.getHelper();
    const step = helper.getStepByIndex(i);
    confirm(Object.assign({}, options, {
      title: 'Remove step',
      message: 'This can\'t be undone.',
    }), (res) => {
      if (res === 1) {
        this.setLoading(step.get('id'), 'Removing...');
        removeStep(goal.get('id'), step.get('id')).then((res) => {
          this.clearLoading(step.get('id'));
          if(res.ok){
            window.analytics.sendEvent('Step removed', {});
          }
        });
        // remove step
      }
    });
  }
  onStepRename(i, title) {
    const { goal, renameStep } = this.props;
    const helper = this.getHelper();
    const step = helper.getStepByIndex(i);
    if(this.getLoading(step.get('id')).loading){
      return;
    }
    this.setLoading(step.get('id'), 'Renaming...');
    renameStep(goal.get('id'), step.get('id'), title).then((res) => {
      this.clearLoading(step.get('id'));
      if(res.ok){
        window.analytics.sendEvent('Step renamed', {});
      }
    });
  }
  onAssign(i, e) {
    const options = this.getOptionsForE(e);
    const { selectAssignees, assignStep, goal } = this.props;
    const helper = this.getHelper();
    const step = helper.getStepByIndex(i);

    options.actionLabel = 'Assign';
    if(step.get('assignees').size){
      options.actionLabel = 'Reassign';
    }
    let overrideAssignees;
    selectAssignees(options, step.get('assignees').toJS(), (newAssignees) => {
      if (newAssignees) {
        overrideAssignees = newAssignees;
      } else if (overrideAssignees) {
        const clearCB = this.clearLoading.bind(null, step.get('id'));
        this.setLoading(step.get('id'), 'Assigning...');
        assignStep(goal.get('id'), step.get('id'), overrideAssignees).then((res) => {
          clearCB();
          if(res.ok){
            window.analytics.sendEvent('Step assigned', {
              'Number of assignees': overrideAssignees.length,
            });
          }
        });
      }
    });
    e.stopPropagation();
  }
  onStepCheck(i, e) {
    const { completeStep, goal, confirm } = this.props;
    const options = this.getOptionsForE(e);
    const helper = this.getHelper();
    const currentI = helper.getCurrentStepIndex();
    const handoff = {
      goalId: helper.getId(),
      backward: (i < currentI),
      fromId: helper.getCurrentStepId(),
    };
    const loadingI = i;
    if (i >= currentI) {
      i += 1;
    }

    const step = helper.getStepByIndex(i);
    const nextStepId = (step && step.get('id')) || null;
    handoff.toId = nextStepId;
    if (handoff.toId && !handoff.fromId) {
      // If the goal was completed, and undo some steps.
      handoff.backward = true;
    }
    const completeHandler = () => {
      this.setLoading('completing', `${loadingI}`);
      this.callDelegate('onStepWillComplete', handoff);
      completeStep(goal.get('id'), nextStepId).then((res) => {
        if (res && res.ok) {
          this.clearLoading('completing');
          this.callDelegate('onStepDidComplete', handoff);
          window.analytics.sendEvent('Step completed', {
            'Iteration': handoff.backward,
          });
        } else {
          this.callDelegate('onStepDidFailComplete', handoff);
          this.clearLoading('completing', '!Something went wrong');
        }
      });
    };

    if (handoff.backward) {
      confirm(Object.assign({}, options, {
        title: 'Make an iteration',
        message: 'Do you want uncheck these steps and redo them',
      }), (res) => {
        if (res === 1) {
          completeHandler();
        }
      });
    } else {
      completeHandler();
    }
  }
  getHelper(overrideGoal) {
    const { goal, myId } = this.props;
    overrideGoal = overrideGoal || goal;
    return new GoalsUtil(overrideGoal, myId);
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
  }
  render() {
    const helper = this.getHelper();
    const {
      tooltip,
      editMode,
    } = this.props;
    const { steps } = this.state;

    return (
      <StepList
        currentStepIndex={helper.getNumberOfCompletedSteps()}
        loadingState={this.getAllLoading()}
        delegate={this}
        steps={steps}
        tooltip={tooltip}
        editMode={editMode}
      />
    );
  }
}

export default connect((state, oP) => ({
  goal: state.getIn(['goals', oP.goalId]),
  myId: state.getIn(['me', 'id']),
}), {
  tooltip: a.main.tooltip,
  addStep: ca.steps.add,
  selectAssignees: a.goals.selectAssignees,
  completeStep: ca.goals.completeStep,
  confirm: a.menus.confirm,
  removeStep: ca.steps.remove,
  renameStep: ca.steps.rename,
  assignStep: ca.steps.assign,
})(HOCStepList);

const { string, object, func, bool } = PropTypes;

HOCStepList.propTypes = {
  goal: map,
  completeStep: func,
  addStep: func,
  renameStep: func,
  removeStep: func,
  confirm: func,
  myId: string,
  editMode: bool,
  tooltip: func,
  delegate: object,
  selectAssignees: func,
  assignStep: func,
};
