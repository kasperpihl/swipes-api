import Collection from './deliver/Collection'
import Decision from './decide/Decision'

const actions = {
  decide: {
    decision: Decision
  },
  deliver: {
    collection: Collection
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