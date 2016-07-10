import * as types from '../constants/ActionTypes'

const initialState = {
  history: [],
  sentTime: new Date()
}

export default function notifications (state = initialState, action) {
  switch(action.type){
    case types.SEND_NOTIFICATION:{
      const time = new Date().getTime();
      const {title, message} from action.payload;

      let newHistory = [], isDuplicate = false
      let newHistory = state.history.forEach((obj) => {
        if(obj.time > (time - 3000)){
          newHistory.push(obj)
          if(obj.title === title && obj.message === message){
            isDuplicate = true;
          }
        }
      })
      if(!isDuplicate){
        newHistory.push({title, message, time})
      }
      return newHistory;
    }
    default:
      return state;
  }
}