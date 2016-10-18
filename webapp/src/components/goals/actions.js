import Collection from './deliver/Collection'
import Decision from './decide/Decision'
import Form from './deliver/Form'
import Note from './deliver/Note'

const actions = {
  decide: {
    decision: Decision
  },
  deliver: {
    form: Form,
    collection: Note,
    note: Note
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