import { Map } from 'immutable'
import { requireParams } from '../../classes/utils'
// fields
import * as fields from '../fields'

export default class GoalsUtil {

  constructor(goal, myId, cache) {
    this.goal = goal;
    this.id = myId;
    this.cache = cache;
  }
  updateGoal(goal){
    requireParams({ goal }, 'updateGoal');
    this.goal = goal;
  }
  isLastStep(stepIndex){
    requireParams({ stepIndex }, 'isLastStep');
    return stepIndex === this.goal.get('steps').size - 1;
  }
  isGoalCompleted(){
    if(this.goal.get('steps').last().get('completed')){
      return true;
    }
    return false;
  }
  isStepCompleted(stepIndex){
    requireParams({ stepIndex }, 'isStepCompleted');
    return this.goal.getIn(['steps', stepIndex, 'completed'])
  }
  fieldForType(type){
    requireParams({ type }, 'fieldForType');
    return fields[type];
  }
  isCurrentStep(stepIndex){
    requireParams({ stepIndex }, 'isCurrentStep');
    return (this.goal.get('currentStepIndex') === stepIndex)
  }
  amIAssigned(stepIndex){
    requireParams({ stepIndex }, 'amIAssigned');
    const step = this.getStepByIndex(stepIndex);
    return step.get('assignees').find((a) => (a.get('id') === this.id)) ? true : false;
  }
  currentStepIndex(){
    return this.goal.get('currentStepIndex');
  }
  currentStep(){
    return this.goal.getIn(['steps', this.currentStepIndex()]);
  }
  runCounter(){
    return this.currentStep().get('iterations').size;
  }
  getFieldFromField(field){
    requireParams({ field }, 'getFieldFromField');
    if(field.get('type') === 'link'){
      const targetField = this.getTargetField(field);
      if(targetField){
        field = targetField;
      }
    }
    return field;
  }
  getIconWithColorForField(field, stepIndex){
    requireParams({ field, stepIndex }, 'getIconWithColorForField');
    const settings = field.get('settings');
    let icon = 'ArrowRightIcon';
    let color = '#007AFF';
    let editable = true;

    if (field.get('type') === 'link' || !settings.get('editable')) {
      editable = false;
      icon = 'DotIcon';
      color = undefined;
    }

    if (settings.get('required')) {
      color = '#FD4A48';
    }

    if(!this.isCurrentStep(stepIndex)){
      color = undefined;
    }

    return [icon, color];
  }
  getFieldAndSettingsFromField(field, stepIndex, merging){
    requireParams({ field, stepIndex }, 'getSettingsForField');
    let options = Map({ fullscreen: false })
    if(this.goal.get('currentStepIndex') !== stepIndex){
      options = options.set('editable', false)
    }
    if(field.get('type') === 'link'){
      options = options.set('editable', false);
      field = this.getTargetField(field);
    }
    const settings = field.get('settings').merge(options).merge(merging);
    return [field, settings];
  }
  getSettingsForField(field, stepIndex, merging){
    return this.getFieldAndSettingsFromField(field, stepIndex, merging)[1];
  }
  // Getting the handoff message from the step before this
  getHandoffMessageForStepIndex(stepIndex){
    requireParams({ stepIndex }, 'getHandoffMessageForStepIndex');
    const step = this.getStepByIndex(stepIndex);
    return this.getHandoffMessageForStep(step);
  }
  getHandoffMessageForStep(step){
    requireParams({ step }, 'getHandoffMessageForStep');
    const stepData = this.getLastIterationFromStep(step);
    if(stepData){
      const prevStepIndex = stepData[1].get('previousStepIndex');
      let maxRunCounter = stepData[0];
      const prevStep = this.getStepByIndex(prevStepIndex);
      if(prevStep && !prevStep.get('completed')){
        maxRunCounter--;
      }
      const pStepData = this.getLastIterationFromStepIndex(prevStepIndex, maxRunCounter);
      if(pStepData){
        return pStepData[1].get('responses').map((r, i) => {
          return r.get('message');
        })
      }
    }
  }

  getLastIterationFromStepIndex(stepIndex, maxIndex){
    const step = this.getStepByIndex(stepIndex);
    return this.getLastIterationFromStep(step, maxIndex);
  }
  getLastIterationFromStep(step, maxIndex){
    if(!step || maxIndex < 0 ){
      return undefined;
    }
    let iterations = step.get('iterations');
    return iterations.findLastEntry((iter, i) => {
      if(typeof maxIndex !== 'undefined' && i > maxIndex){
        return false;
      }
      return (iter !== null);
    })
  }



  getStepFieldIndexFromTarget(target){
    let res;
    if(target && target.get('type') === 'field'){
      res = this.getStepAndFieldIndexById(target.get('id'));
    }
    return res;
  }


  _getDataForFieldAndStepIndex(sI, fI){
    const step = this.getStepByIndex(sI);
    const field = this.getFieldByIndex(step, fI);
    let data = Map();

    const lastIteration = this.getLastIterationFromStep(step);
    if(field.get('initial_data')) {
      data = field.get('initial_data');
    }
    if(lastIteration){
      const lastResponse = lastIteration[1].getIn(['responses', this.id, 'data', fI]);
      if(lastResponse){
        data = lastResponse;
      }
    }
    // Check for cache and that it is this step
    if(this.cache && sI === this.cache.get('stepIndex')){
      // Check that the cache is the currentStep
      if(this.isCurrentStep(this.cache.get('stepIndex'))){
        // And still the same iteration
        if(this.runCounter() === this.cache.get('runCounter')){
          // Make sure the cache has data.
          const cachedData = this.cache.getIn(['data', fI]);
          if(cachedData){
            data = cachedData;
          }
        }
      }

    }

    const Field = this.fieldForType(field.get('type'));
    if(typeof Field.parseInitialData === 'function'){
      data = Field.parseInitialData(data);
    }
    return data;
  }
  getTargetField(field){
    const target = field.getIn(['settings', 'target']);
    const tSFIndex = this.getStepFieldIndexFromTarget(target);
    if(tSFIndex){
      return this.goal.getIn(['steps', tSFIndex[0], 'fields', tSFIndex[1]]);
    }
  }
  getInitialDataForStepIndex(stepIndex){
    const step = this.getStepByIndex(stepIndex);
    return step.get('fields').map((field, i) => {
      if(field.get('type') === 'link'){
        const target = field.getIn(['settings', 'target']);
        const tSFIndex = this.getStepFieldIndexFromTarget(target);
        if(tSFIndex){

          return this._getDataForFieldAndStepIndex(tSFIndex[0], tSFIndex[1])
        }
      }
      return this._getDataForFieldAndStepIndex(stepIndex, i);
    });
  }

  getFieldByIndex(step, index){
    return step.getIn(['fields', index]);
  }
  getStepByIndex(index){
    return this.goal.getIn(['steps', index]);
  }
  // Get a field by its unique id # checklist-1
  getFieldById(id){
    const stepAndField = this.getStepAndFieldById(id);
    return stepAndField && stepAndField[1];
  }
  // Get the step that has field with id
  getStepByFieldId(id){
    const stepAndField = this.getStepAndFieldById(id);
    return stepAndField && stepAndField[0];
  }
  getStepAndFieldIndexById(id){
    let step, field;
    this.goal.get('steps').forEach((s, sI) => {
      s.get('fields').forEach((f, fI) => {
        if(f.get('id') === id){
          field = fI;
          step = sI;
        }
      })
    })
    return [step, field];
  }
  // Get [step, field] from a field id;
  getStepAndFieldById(id){
    const indexes = this.getStepAndFieldIndexById(id);
    if(indexes){
      const step = this.getStepByIndex(indexes[0])
      const field = this.getFieldByIndex(step, indexes[1]);
      return [step, field];
    }
  }
  // Get a step by its index
  getStepByIndex(index){
    return this.goal.get('steps').find((s, i) => (i === index));
  }


  // ===============================================
  // Status message for steps
  // ===============================================
  getStatusForCurrentStep(){
    return this.getStatusForStepIndex(this.goal.get('currentStepIndex'));
  }
  getStatusForStepIndex(stepIndex, runCounter){
    const step = this.getStepByIndex(stepIndex);

    let status;

    const isMine = step.get('assignees').find((a) => (a.get('id') === this.id))
    if(step.get('completed')){
      status = 'This step was completed';
    }
    else if(stepIndex === this.goal.get('currentStepIndex')){
      status = 'Waiting for people to complete this step';
      if(isMine){
        status = 'You need to complete this step';
      }
    }
    else if(stepIndex > this.goal.get('currentStepIndex')){
      status = 'This step is yet to be completed';
    }
    return status;
  }
}
