import Collection from './deliver/Collection'
import Decision from './decide/Decision'
import DecideForm from './decide/Form'

import Form from './deliver/Form'
import Note from './deliver/Note'
import Checklist from './secondary/Checklist'

const actions = {
  decide: {
    form: DecideForm,
    decision: Decision
  },
  deliver: {
    form: Form,
    collection: Collection,
    note: Note
  },
  secondary: {
    checklist: Checklist,
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
