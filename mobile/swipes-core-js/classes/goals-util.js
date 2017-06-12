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
  getStepIndexForId(id) {
    return this.goal.get('step_order').findKey(v => (v === id));
  }

  getStepOrder() {
    return this.goal.get('step_order');
  }

  // ======================================================
  // Get step
  // ======================================================

  getStepByIndex(index) {
    const id = this.goal.getIn(['step_order', index]);
    return this.getStepById(id);
  }
  getStepById(id) {
    return this.goal.getIn(['steps', id]);
  }

  getIsStepCompleted(s) {
    if(typeof s === 'string'){
      s = this.goal.getIn(['steps', s]);
    }
    return s.get('completed_at');
  }

  getIsCompleted() {
    return !!this.goal.get('completed_at');
  }
  amIAssigned() {
    const step = this.getCurrentStep();
    if (!step) {
      return false;
    }
    return !!step.get('assignees').find(a => (a === this.id));
  }

  getNewStepOrder(oldIndex, newIndex) {
    const movedId = this.goal.getIn(['step_order', oldIndex]);
    return this.goal.get('step_order').delete(oldIndex).insert(newIndex, movedId);
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

  getNumberOfCompletedSteps() {
    if (this.getIsCompleted()) {
      return this.goal.get('step_order').size;
    }
    let numberOfCompleted = 0;
    this.getOrderedSteps().forEach((s) => {
      if(this.getIsStepCompleted(s)) {
        numberOfCompleted += 1;
      }
    })
    return numberOfCompleted;
  }
  getNumberOfSteps() {
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

  getAllAssignees() {
    const assignees = new Set();
    this.goal.get('steps').forEach((s) => {
      s.get('assignees').forEach(aId => assignees.add(aId));
    });
    return fromJS([...assignees]);
  }
  getCurrentAssignees() {
    const assignees = new Set();
    this.goal.get('steps').forEach((s) => {
      if(!this.getIsStepCompleted(s)){
        s.get('assignees').forEach(aId => assignees.add(aId));
      }
    });
    return fromJS([...assignees]);
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
  getLastActivityByType(type) {
    return this.goal.get('history').findLast((a) => a.get('type') === type);
  }
  getLastActivityIndex() {
    return this.goal.get('history').size - 1;
  }

  hasIRepliedToHistory(hE) {
    const history = this.goal.get('history');
    const index = history.findIndex(h => h.get('group_id') === hE.get('group_id'));
    return history.find(h => h.get('reply_to') === index);
  }

  getObjectForWay() {
    return {
      title: this.goal.get('title'),
      steps: this.goal.get('steps').map(g => g.delete('completed_at')).filter(g => this.goal.get('step_order').includes(g.get('id'))),
      step_order: this.goal.get('step_order'),
      attachments: this.goal.get('attachments'),
      attachment_order: this.goal.get('attachment_order'),
    };
  }
}
