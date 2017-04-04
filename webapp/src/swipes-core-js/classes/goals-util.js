import { fromJS } from 'immutable';

export default class GoalsUtil {

  constructor(goal, myId) {
    this.goal = goal;
    this.id = myId;
  }
  updateGoal(goal) {
    this.goal = goal;
  }

  getId() {
    return this.goal.get('id');
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
  getNextStepId() {
    const nextIndex = this.getCurrentStepIndex() + 1;
    const nextStep = this.getStepByIndex(nextIndex);
    return (nextStep && nextStep.get('id')) || null;
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
  getAttachmentsForFlags(flags) {
    flags = fromJS(flags || []);
    return flags.map(fId => (this.goal.getIn(['attachments', fId]))).filter(v => !!v);
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
  getStepTitleFromId(id) {
    return this.goal.getIn(['steps', id, 'title']);
  }
  getStepTitlesBetweenIds(from, to) {
    let show = false;
    let titles = fromJS([]);
    this.goal.get('step_order').forEach((sId) => {
      if ([from, to].indexOf(sId) !== -1) show = !show;
      if (show) {
        titles = titles.push(this.goal.getIn(['steps', sId, 'title']));
      }
    });
    return titles;
  }

  getCurrentAssignees() {
    const i = this.getCurrentStepIndex();
    return this.getAssigneesForStepIndex(i);
  }
  getAssigneesForStepId(id) {
    const stepIndex = this.getStepIndexForId(id);
    return this.getAssigneesForStepIndex(stepIndex);
  }
  getAssigneesForStepIndex(i) {
    const step = this.getStepByIndex(i);
    if (!step) {
      return fromJS([]);
    }
    return step.get('assignees');
  }
  getActivityByIndex(index) {
    return this.goal.getIn(['history', index]);
  }
  getLastActivity() {
    return this.goal.get('history').last();
  }
  getLastActivityIndex() {
    return this.goal.get('history').size - 1;
  }
  getAllInvolvedAssignees() {
    const assignees = new Set();
    this.goal.get('steps').forEach((s) => {
      s.get('assignees').forEach(aId => assignees.add(aId));
    });
    this.goal.get('history').forEach((h) => {
      assignees.add(h.get('done_by'));
    });
    return fromJS([...assignees]);
  }
  hasIRepliedToHistory(hE) {
    const history = this.goal.get('history');
    const index = history.findIndex(h => h.get('group_id') === hE.get('group_id'));
    return history.find(h => h.get('reply_to') === index);
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
