export default class GoalsUtil {

  constructor(goal, myId) {
    this.goal = goal;
    this.id = myId;
  }
  updateGoal(goal) {
    this.goal = goal;
  }
  getCurrentStepId() {
    return this.goal.getIn(['status', 'current_step_id']);
  }
  getStepByIndex(index) {
    const id = this.goal.getIn(['step_order', index]);
    return this.goal.getIn(['steps', id]);
  }
  getCurrentStepIndex() {
    const id = this.getCurrentStepId();
    return this.goal.get('step_order').findKey(v => (v === id));
  }
  getCurrentStep() {
    return this.goal.getIn(['steps', this.getCurrentStepId()]);
  }
  getNextStep() {
    const nextIndex = this.getCurrentStepIndex() + 1;
    return this.getStepByIndex(nextIndex);
  }
  amIAssigned() {
    const step = this.getCurrentStep();
    return step.get('assignees').find(a => (a === this.id));
  }
  getOrderedSteps() {
    return this.goal.get('step_order').map(id => this.goal.getIn(['steps', id]));
  }
  getOrderedAttachments() {
    return this.goal.get('attachment_order').map(id => this.goal.getIn(['attachments', id]));
  }
  getNumberOfCompletedSteps() {
    const currentIndex = this.getCurrentStepIndex();
    return currentIndex;
  }
  getTotalNumberOfSteps() {
    return this.goal.get('step_order').size;
  }

  // Getting the handoff message from the step before this
  getHandoffMessage() {
    const status = this.goal.get('status');
    return {
      message: status.get('handoff_message'),
      by: status.get('handoff_by'),
      at: status.get('handoff_at'),
    };
  }

  getStatus() {
    const step = this.getCurrentStep();

    let status = 'Waiting for people to complete this step';
    const isMine = step.get('assignees').find(a => (a === this.id));
    if (isMine) {
      status = 'You need to complete this step';
    }
    return status;
  }
}
