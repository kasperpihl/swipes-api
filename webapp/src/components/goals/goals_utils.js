export function getStatusForCurrentStep(goal, myId){
  return getStatusForStepWithIndex(goal, goal.get('currentStepIndex'), myId);
}

export function getStatusForStepWithIndex(goal, stepIndex, myId, runCounter){

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
