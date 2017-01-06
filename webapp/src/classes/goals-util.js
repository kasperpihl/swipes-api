import { Map } from 'immutable';
import { requireParams } from 'classes/utils';
// fields
import * as fields from 'src/react/swipes-fields';

export default class GoalsUtil {

  constructor(goal, myId, cache) {
    this.goal = goal;
    this.id = myId;
    this.cache = cache;
  }
  updateGoal(goal) {
    requireParams({ goal }, 'updateGoal');
    this.goal = goal;
  }
  isLastStep(stepIndex) {
    requireParams({ stepIndex }, 'isLastStep');
    return stepIndex === this.goal.get('steps').size - 1;
  }
  isGoalCompleted() {
    if (this.goal.get('steps').last().get('completed')) {
      return true;
    }
    return false;
  }
  isStepCompleted(stepIndex) {
    requireParams({ stepIndex }, 'isStepCompleted');
    return this.goal.getIn(['steps', stepIndex, 'completed']);
  }

  isCurrentStep(stepIndex) {
    requireParams({ stepIndex }, 'isCurrentStep');
    return (this.goal.get('currentStepIndex') === stepIndex);
  }
  amIAssigned(stepIndex) {
    requireParams({ stepIndex }, 'amIAssigned');
    const step = this.getStepByIndex(stepIndex);

    return step.get('assignees').find(a => (a === this.id));
  }
  currentStepIndex() {
    return this.goal.get('currentStepIndex');
  }
  currentStep() {
    return this.goal.getIn(['steps', this.currentStepIndex()]);
  }
  runCounter() {
    return this.currentStep().get('iterations').size;
  }


  // Getting the handoff message from the step before this
  getHandoffMessageForStepIndex(stepIndex) {
    requireParams({ stepIndex }, 'getHandoffMessageForStepIndex');
    const step = this.getStepByIndex(stepIndex);

    return this.getHandoffMessageForStep(step);
  }
  getHandoffMessageForStep(step) {
    requireParams({ step }, 'getHandoffMessageForStep');
    const stepData = this.getLastIterationFromStep(step);

    if (stepData) {
      const prevStepIndex = stepData[1].get('previousStepIndex');
      let maxRunCounter = stepData[0];
      const prevStep = this.getStepByIndex(prevStepIndex);

      if (prevStep && !prevStep.get('completed')) {
        maxRunCounter -= 1;
      }

      const pStepData = this.getLastIterationFromStepIndex(prevStepIndex, maxRunCounter);

      if (pStepData) {
        return pStepData[1].get('responses').map(r => r.get('message'));
      }
    }

    return undefined;
  }
  getLastIterationFromStepIndex(stepIndex, maxCounter) {
    const step = this.getStepByIndex(stepIndex);

    return this.getLastIterationFromStep(step, maxCounter);
  }
  getLastIterationFromStep(step, maxCounter) {
    if (!step || maxCounter < 1) {
      return undefined;
    }

    const iteration = step.get('iterations').findLastEntry((iter, i) => {
      if (typeof maxCounter !== 'undefined' && (i + 1) > maxCounter) {
        return false;
      }

      return (iter !== null);
    });

    if (iteration) {
      iteration[0] += 1;
    }

    return iteration;
  }


  // Get a step by its index
  getStepByIndex(index) {
    return this.goal.get('steps').find((s, i) => (i === index));
  }


  // ===============================================
  // Status message for steps
  // ===============================================
  getStatusForCurrentStep() {
    return this.getStatusForStepIndex(this.goal.get('currentStepIndex'));
  }
  getStatusForStepIndex(stepIndex) {
    const step = this.getStepByIndex(stepIndex);

    let status;

    const isMine = step.get('assignees').find(a => (a === this.id));
    if (step.get('completed')) {
      status = 'This step was completed';
    } else if (stepIndex === this.goal.get('currentStepIndex')) {
      status = 'Waiting for people to complete this step';
      if (isMine) {
        status = 'You need to complete this step';
      }
    } else if (stepIndex > this.goal.get('currentStepIndex')) {
      status = 'This step is yet to be completed';
    }
    return status;
  }
}
