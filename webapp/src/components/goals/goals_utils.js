export function getStatusForCurrentStep(goal, myId){
  return getStatusForStepWithIndex(goal, goal.get('currentStepIndex'), myId);
}

export function getStatusForStepWithIndex(goal, stepIndex, myId, runCounter){
  const step = goal.getIn(['steps', stepIndex]);

  let status;

  const isMine = step.get('assignees').find((a) => (a.get('id') === myId))
  if(step.get('completed')){
    status = 'This step was completed';
  }
  else if(stepIndex === goal.get('currentStepIndex')){
    status = 'Waiting for people to complete this step';
    if(isMine){
      status = 'You need to complete this step';
    }
  }
  else if(stepIndex > goal.get('currentStepIndex')){
    status = 'This step is yet to be completed';
  }
  return status;
}

export function getDataForStepIndex(goal, stepIndex, myId){
  const step = goal.getIn(['steps', stepIndex]);
  return step.get('fields').map((field, i) => {
    let lastIteration = getLastIterationFromStep(step);
    if(field.get('type') === 'link'){
      const target = field.getIn(['settings', 'target']);
      if(target && target.get('type') === 'field'){
        const stepField = getStepAndFieldById(target.get('id'));
        if(stepField){
          field = stepField[1];
          lastIteration = getLastIterationFromStep(stepField[0], lastIteration ? lastIteration[0] : undefined);
        }
      }
    }

    let data = {};
    if(field.get('initial_data')) {
      data = field.get('initial_data').toJS();
    }

    if(lastIteration){
      const myLastResponseToField = lastIteration[1].getIn(['responses', myId, 'data', i]);
      if(myLastResponseToField){
        data = myLastResponseToField.toJS();
      }
    }

    return data;
  });
}

export function getHandoffMessageForStepIndex(goal, stepIndex, users){
  const step = goal.getIn(['steps', stepIndex]);
  const stepData = getLastIterationFromStep(step);
  if(stepData){
    const prevStepIndex = stepData[1].get('previousStepIndex');
    const maxRunCounter = stepData[0];

    const pStep = goal.getIn(['steps', prevStepIndex]);
    const pStepData = getLastIterationFromStep(pStep, maxRunCounter);
    if(pStepData){
      return pStepData[1].get('responses').map((r, i) => {
        return r.get('message');
      })
    }
  }
}

export function getLastIterationFromStep(step, maxIndex){
  if(!step || !step.get('iterations') || maxIndex < 0 ){
    return undefined;
  }
  return step.get('iterations').findLastEntry((iter, i) => {
    if(typeof maxIndex !== 'undefined' && i > maxIndex){
      return false;
    }
    return (iter !== null);
  })
}

// Get a field by its unique id # checklist-1
export function getFieldById(goal, id){
  const stepAndField = getStepAndFieldById(goal, fieldId);
  return stepAndField && stepAndField[1];
}

// Get the step that has field with id
export function getStepByFieldId(goal, fieldId){
  const stepAndField = getStepAndFieldById(goal, fieldId);
  return stepAndField && stepAndField[0];
}

// Get [step, field] from a field id;
export function getStepAndFieldById(goal, fieldId){
  let step, field;
  goal.get('steps').forEach((s) => {
    s.get('fields').forEach((f) => {
      if(f.get('id') === fieldId){
        field = f;
        step = s;
      }
    })
  })
  return [step, field];
}

// Get a step by its index
export function getStepByIndex(goal, index){
  return goal.get('steps').find((s, i) => (i === index));
}
