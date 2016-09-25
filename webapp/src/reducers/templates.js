import * as types from '../constants/ActionTypes'
import clone from 'clone'
const initialState = {};

export default function templates (state = initialState, action) {
  switch (action.type) {
    case ('rtm.start'):{
      const res = action.payload;
      if(res.ok){
        const templates = {}
        res.goals_templates.forEach((template) => {
          templates[template.id] = template;
        })
        return templates;
      }
      return state;
    }
    case types.LOGOUT:{
      return clone(initialState);
    }
    default: 
      return state
  }
}