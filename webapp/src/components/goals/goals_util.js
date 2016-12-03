import { Map } from 'immutable';
import { requireParams } from '../../classes/utils';
// fields
import * as fields from '../fields';

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
  fieldForType(type) {
    requireParams({ type }, 'fieldForType');
    return fields[type];
  }
  isCurrentStep(stepIndex) {
    requireParams({ stepIndex }, 'isCurrentStep');
    return (this.goal.get('currentStepIndex') === stepIndex);
  }
  amIAssigned(stepIndex) {
    requireParams({ stepIndex }, 'amIAssigned');
    const step = this.getStepByIndex(stepIndex);

    return step.get('assignees').find(a => (a.get('id') === this.id));
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
  getFieldFromField(field) {
    requireParams({ field }, 'getFieldFromField');
    let newField = field;

    if (newField.get('type') === 'link') {
      const targetField = this.getTargetField(newField);

      if (targetField) {
        newField = targetField;
      }
    }

    return newField;
  }
  getIconWithColorForField(field, stepIndex) {
    requireParams({ field, stepIndex }, 'getIconWithColorForField');
    const settings = field.get('settings');
    let icon = 'ArrowRightIcon';
    let color = '#007AFF';

    if (field.get('type') === 'link' || !settings.get('editable')) {
      icon = 'DotIcon';
      color = undefined;
    }

    if (settings.get('required')) {
      color = '#FD4A48';
    }

    if (!this.isCurrentStep(stepIndex)) {
      color = undefined;
    }

    return [icon, color];
  }
  getFieldAndSettingsFromField(field, stepIndex, merging) {
    requireParams({ field, stepIndex }, 'getSettingsForField');
    let newField = field;
    let options = Map({ fullscreen: false });

    if (this.goal.get('currentStepIndex') !== stepIndex) {
      options = options.set('editable', false);
    }

    if (newField.get('type') === 'link') {
      options = options.set('editable', false);
      newField = this.getTargetField(newField);
    }

    const settings = newField.get('settings').merge(options).merge(merging);

    return [newField, settings];
  }
  getSettingsForField(field, stepIndex, merging) {
    return this.getFieldAndSettingsFromField(field, stepIndex, merging)[1];
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
  getStepFieldIndexFromTarget(target) {
    let res;
    if (target && target.get('type') === 'field') {
      res = this.getStepAndFieldIndexById(target.get('id'));
    }
    return res;
  }
  getDataForFieldAndStepIndex(sI, fI) {
    const step = this.getStepByIndex(sI);
    const field = this.getFieldByIndex(step, fI);
    let data = Map();

    if (field.get('initial_data')) {
      data = field.get('initial_data');
    }

    const thisIteration = this.getLastIterationFromStep(step);
    const lastIteration = this.getLastIterationFromStep(step, this.runCounter() - 1);

    if (lastIteration) {
      // console.log(
    //   'lastIteration',
    //   'sI',
    //   sI,
    //   'fI',
    //   fI,
    //   'run#',
    //   lastIteration[0],
    //   'oldD',
    //   lastIteration[1].toJS()
    // );
      const lastResponse = lastIteration[1].getIn(['responses', this.id, 'data', fI]);

      if (lastResponse) {
        // console.log('response!', lastResponse.toJS());
        data = lastResponse;
      }
    }
    if (thisIteration) {
      // console.log(
      //   'lastIteration',
      //   'sI',
      //   sI,
      //   'fI',
      //   fI,
      //   'run#',
      //   lastIteration[0],
      //   'oldD',
      //   lastIteration[1].toJS()
      // );
      const thisResponse = thisIteration[1].getIn(['responses', this.id, 'data', fI]);

      if (thisResponse) {
        // console.log('response!', thisResponse.toJS());
        data = thisResponse;
      }
    }

    // Check for cache and that it is this step
    if (this.cache && sI === this.cache.get('stepIndex')) {
      // Check that the cache is the currentStep
      if (this.isCurrentStep(this.cache.get('stepIndex'))) {
        // And still the same iteration
        if (this.runCounter() === this.cache.get('runCounter')) {
          // Make sure the cache has data.
          const cachedData = this.cache.getIn(['data', fI]);
          if (cachedData) {
            // console.log('cached data');
            data = cachedData;
          }
        }
      }
    }

    const Field = this.fieldForType(field.get('type'));

    if (typeof Field.parseInitialData === 'function') {
      data = Field.parseInitialData(data);
    }

    return data;
  }
  getTargetField(field) {
    const target = field.getIn(['settings', 'target']);
    const tSFIndex = this.getStepFieldIndexFromTarget(target);

    if (tSFIndex) {
      return this.goal.getIn(['steps', tSFIndex[0], 'fields', tSFIndex[1]]);
    }

    return undefined;
  }
  getInitialDataForStepIndex(stepIndex) {
    const step = this.getStepByIndex(stepIndex);
    return step.get('fields').map((field, i) => {
      if (field.get('type') === 'link') {
        const target = field.getIn(['settings', 'target']);
        const tSFIndex = this.getStepFieldIndexFromTarget(target);
        if (tSFIndex) {
          return this.getDataForFieldAndStepIndex(tSFIndex[0], tSFIndex[1]);
        }
      }
      return this.getDataForFieldAndStepIndex(stepIndex, i);
    });
  }

  getFieldByIndex(step, index) {
    return step.getIn(['fields', index]);
  }
  // getStepByIndex(index) {
  //   return this.goal.getIn(['steps', index]);
  // }
  // Get a field by its unique id # checklist-1
  getFieldById(id) {
    const stepAndField = this.getStepAndFieldById(id);
    return stepAndField && stepAndField[1];
  }
  // Get the step that has field with id
  getStepByFieldId(id) {
    const stepAndField = this.getStepAndFieldById(id);
    return stepAndField && stepAndField[0];
  }
  getStepAndFieldIndexById(id) {
    let step;
    let field;

    this.goal.get('steps').forEach((s, sI) => {
      s.get('fields').forEach((f, fI) => {
        if (f.get('id') === id) {
          field = fI;
          step = sI;
        }
      });
    });

    return [step, field];
  }
  // Get [step, field] from a field id;
  getStepAndFieldById(id) {
    const indexes = this.getStepAndFieldIndexById(id);
    if (indexes) {
      const step = this.getStepByIndex(indexes[0]);
      const field = this.getFieldByIndex(step, indexes[1]);
      return [step, field];
    }

    return undefined;
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

    const isMine = step.get('assignees').find(a => (a.get('id') === this.id));
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
