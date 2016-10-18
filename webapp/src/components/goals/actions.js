import Collection from './deliver/Collection'
import Decision from './decide/Decision'
import FormStep from './deliver/FormStep'
const actions = {
  decide: {
    decision: Decision
  },
  deliver: {
    form: FormStep,
    collection: FormStep
  }
}

function actionForType(type, subtype){
  if(actions[type]){
    return actions[type][subtype];
  }
  return undefined;
}
export {
  actionForType
}