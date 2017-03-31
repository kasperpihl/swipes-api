import React, { PureComponent, PropTypes } from 'react';
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
    this.callDelegate = setupDelegate(props.delegate);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.goal !== this.props.goal) {
      const helper = this.getHelper(nextProps.goal);
      this.setState({ steps: helper.getOrderedSteps() });
    }
  }
  onStepAdd(title) {
    const { addStep, goal } = this.props;
    this.setLoading('add', 'Adding...');
    addStep(goal.get('id'), title).then(() => this.clearLoading('add'));
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
        removeStep(goal.get('id'), step.get('id')).then(() => {
          this.clearLoading(step.get('id'));
        });
        // remove step
      }
    });
  }
  onStepRename(i, title) {
    const { goal, renameStep } = this.props;
    const helper = this.getHelper();
    const step = helper.getStepByIndex(i);
    this.setLoading(step.get('id'), 'Renaming...');
    renameStep(goal.get('id'), step.get('id'), title).then(() => {
      this.clearLoading(step.get('id'));
    });
  }
  onAssign(i, e) {
    const options = this.getOptionsForE(e);
    const { selectAssignees, assignStep, goal } = this.props;
    const helper = this.getHelper();
    const step = helper.getStepByIndex(i);

    options.actionLabel = 'Reassign';
    let overrideAssignees;
    selectAssignees(options, step.get('assignees').toJS(), (newAssignees) => {
      if (newAssignees) {
        overrideAssignees = newAssignees;
      } else if (overrideAssignees) {
        const clearCB = this.clearLoading.bind(null, step.get('id'));
        this.setLoading(step.get('id'), 'Assigning...');
        assignStep(goal.get('id'), step.get('id'), overrideAssignees).then(() => clearCB());
      }
    });
    e.stopPropagation();
  }
  onStepCheck(i) {
    const { completeStep, goal } = this.props;
    const helper = this.getHelper();
    const currentI = helper.getCurrentStepIndex();
    const handoff = { backward: (i < currentI), fromId: helper.getCurrentStepId() };
    this.setLoading('completing', `${i}`);
    if (i >= currentI) {
      i += 1;
    }

    const step = helper.getStepByIndex(i);
    const nextStepId = (step && step.get('id')) || null;
    handoff.toId = nextStepId;
    completeStep(goal.get('id'), nextStepId).then((res) => {
      if (res && res.ok) {
        this.clearLoading('completing');
      } else {
        this.clearLoading('completing', '!Something went wrong');
      }
    });
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
        editMode
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
