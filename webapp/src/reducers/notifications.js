import * as types from '../constants/ActionTypes'
import { fromJS } from 'immutable'

const initialState = fromJS({
  history: [],
  sentTime: new Date()
})

export default function notifications (state = initialState, action) {
  switch(action.type){
    case types.SEND_NOTIFICATION:{
      const time = new Date().getTime();
      const {title, message} =  action.payload;

      let newHistory = [], isDuplicate = false
      state.get('history').forEach((obj) => {
        if(obj.get('time') > (time - 3000)){
          newHistory.push(obj)
          if(obj.get('title') === title && obj.get('message') === message){
            isDuplicate = true;
          }
        }
      })
      if(!isDuplicate){
        newHistory.push({title, message, time})
      }
      return state.set('history', fromJS(newHistory));
    }
    case types.LOGOUT:{
      return initialState;
    }
    default:
      return state;
  }
}