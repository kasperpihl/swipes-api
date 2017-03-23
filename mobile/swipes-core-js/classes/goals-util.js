import { fromJS } from 'immutable';

export default class GoalsUtil {

  constructor(goal, myId) {
    this.goal = goal;
    this.id = myId;
  }
  updateGoal(goal) {
    this.goal = goal;
  }

  // ======================================================
  // Get stepIndex
  // ======================================================
  getCurrentStepIndex() {
    const id = this.getCurrentStepId();
    return this.getStepIndexForId(id);
  }
  getStepIndexForId(id) {
    return this.goal.get('step_order').findKey(v => (v === id));
  }

  // ======================================================
  // Get stepId
  // ======================================================
  getCurrentStepId() {
    return this.goal.getIn(['status', 'current_step_id']);
  }

  // ======================================================
  // Get step
  // ======================================================
  getCurrentStep() {
    return this.goal.getIn(['steps', this.getCurrentStepId()]);
  }
  getNextStep() {
    const nextIndex = this.getCurrentStepIndex() + 1;
    return this.getStepByIndex(nextIndex);
  }
  getStepByIndex(index) {
    const id = this.goal.getIn(['step_order', index]);
    return this.getStepById(id);
  }
  getStepById(id) {
    return this.goal.getIn(['steps', id]);
  }

  getIsStarted() {
    return this.goal.getIn(['status', 'started']);
  }
  getIsCompleted() {
    return this.goal.getIn(['status', 'completed']);
  }
  amIAssigned() {
    const step = this.getCurrentStep();
    if (!step) {
      return false;
    }
    return !!step.get('assignees').find(a => (a === this.id));
  }

  isUserCurrentlyAssigned(userId) {
    const step = this.getCurrentStep();
    if (!step) {
      return false;
    }
    return !!step.get('assignees').find(a => (a === userId));
  }

  getOrderedSteps() {
    return this.goal.get('step_order').map(id => this.goal.getIn(['steps', id]));
  }
  getOrderedAttachments() {
    return this.goal.get('attachment_order').map(id => this.goal.getIn(['attachments', id]));
  }
  getLastHandoff() {
    return this.goal.get('history').findLast((h) => {
      switch (h.get('type')) {
        case 'goal_created':
        case 'goal_started':
        case 'step_completed':
        case 'goal_completed':
          return true;
        default:
          return false;
      }
    });
  }
  getLastUpdate() {
    return this.goal.get('updated_at');
  }

  getRemainingSteps() {
    return this.getOrderedSteps().slice(this.getCurrentStepIndex());
  }
  getNumberOfCompletedSteps() {
    if (this.getIsCompleted()) {
      return this.goal.get('step_order').size;
    }
    return this.getCurrentStepIndex() || 0;
  }
  getTotalNumberOfSteps() {
    return this.goal.get('step_order').size;
  }


  getCurrentAssignees() {
    const i = this.getCurrentStepIndex();
    return this.getAssigneesForStepIndex(i);
  }
  getAssigneesForStepIndex(i) {
    const step = this.getStepByIndex(i);
    if (!step) {
      return fromJS([]);
    }
    return step.get('assignees');
  }
  getAllInvolvedAssignees() {
    const assignees = new Set();
    this.goal.get('steps').forEach((s) => {
      s.get('assignees').forEach(aId => assignees.add(aId));
    });
    return fromJS([...assignees]);
  }
  hasEmptyStepsLater() {
    const steps = this.getRemainingSteps();
    return (steps.filter(s => !s.get('assignees').size).size > 0);
  }
  getRemainingAssignees() {
    const steps = this.getRemainingSteps();
    const assignees = new Set();
    steps.forEach((s) => {
      s.get('assignees').forEach(aId => assignees.add(aId));
    });
    return fromJS([...assignees]);
  }

  getObjectForWay() {
    return {
      title: this.goal.get('title'),
      steps: this.goal.get('steps'),
      step_order: this.goal.get('step_order'),
      attachments: this.goal.get('attachments'),
      attachment_order: this.goal.get('attachment_order'),
    };
  }
}