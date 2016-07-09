import * as types from '../constants/ActionTypes'

const initialState = {};

export default function tiles (state = initialState, action) {
  switch (action.type) {
    case ('rtm.start'):{
      const res = action.payload;
      if(res.ok){
        const tiles = {}
        res.workflows.forEach((tile) => {
          tiles[tile.id] = tile;
        })
        return tiles;
      }
      return state;
    }
    case types.SOCKET_MESSAGE:{
      const msg = action.payload;
      switch(msg.type){
        case 'workflow_added':
        case 'workflow_changed':{
          return Object.assign({}, state, {[msg.data.id]: msg.data});
        }
        case 'workflow_removed': {
          const newState = Object.assign({}, state);
          delete newState[msg.data.id];
          return newState;
        }
        default:
          return state
      }
    }
    default: 
      return state
  }
}