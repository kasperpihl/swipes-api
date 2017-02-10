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

  getIsCompleted() {
    return !this.getCurrentStep();
  }
  getCurrentFlags() {
    return this.goal.getIn(['status', 'flags']);
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
    return this.goal.get('history').findLast(h => (['created', 'complete_step', 'complete_goal'].indexOf(h.get('type')) !== -1));
  }
  getLastUpdate() {
    return this.goal.get('updated_at');
  }

  getRemainingSteps() {
    return this.getOrderedSteps().slice(this.getCurrentStepIndex());
  }
  getNumberOfCompletedSteps() {
    if (!this.getCurrentStep()) {
      return this.goal.get('step_order').size;
    }
    return this.getCurrentStepIndex();
  }
  getTotalNumberOfSteps() {
    return this.goal.get('step_order').size;
  }


  getCurrentAssignees() {
    const step = this.getCurrentStep();
    if (!step) {
      return false;
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

  getHandoffMessage() {
    const status = this.goal.get('status');
    return {
      message: status.get('handoff_message'),
      by: status.get('handoff_by'),
      at: status.get('handoff_at'),
    };
  }
}
