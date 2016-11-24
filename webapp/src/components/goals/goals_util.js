import { Map } from 'immutable'
// fields
import * as fields from '../fields'

export default class GoalsUtil {
  constructor(goal, myId, cache) {
    this.goal = goal;
    this.id = myId;
    this.cache = cache;

  }
  fieldForType(type){
    return fields[type];
  }
  isCurrentStep(stepIndex){
    return (this.goal.get('currentStepIndex') === stepIndex)
  }
  amIAssigned(stepIndex){
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
  // Getting the handoff message from the step before this
  getHandoffMessageForStepIndex(stepIndex, users){
    const step = this.getStepByIndex(stepIndex);
    return this.getHandoffMessageForStep(step, users);
  }
  getHandoffMessageForStep(step, users){

    const stepData = this.getLastIterationFromStep(step);
    if(stepData){
      const prevStepIndex = stepData[1].get('previousStepIndex');
      const maxRunCounter = stepData[0];

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
    return step.get('iterations').findLastEntry((iter, i) => {
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
