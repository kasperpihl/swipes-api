import * as types from '../constants/ActionTypes'
import { fromJS, Map } from 'immutable'

const initialState = fromJS({ tiles : {}, columns : [] });

function fillTilesToColumns(cols, tiles){
  let et = {};
  cols = cols.filter((c) => c.get('rows').filter( (r) => { 
    et[r.get('id')] = true; 
    return (tiles.get(r.get('id')));
  }));

  tiles.forEach((t) => {
    if(!et[t.get('id')]){
      cols = cols.push(fromJS({ rows: [ {id: t.get('id')} ] }))
    }
  })
  return cols;
}

export default function workspace (state = initialState, action) {
  const oldState = state;
  let msg;
  switch(action.type){
    case types.UPDATE_COLUMNS:{
      state = state.set('columns', fromJS(action.columns));
      break;
    }

    case types.TILE_SAVE_DATA: {
      if(action.options){
        state = state.setIn(['tiles', action.tileId, 'data'], null);
      }
      state = state.mergeIn(['tiles', action.tileId, 'data', action.data]);
      break;
    }

    case ('rtm.start'):{ // API Request
      const res = action.payload;
      if(res.ok){
        const tiles = {}
        res.workflows.forEach((tile) => {
          tiles[tile.id] = tile;
        })
        state = state.set('tiles', fromJS(tiles));
      }
      break;
    }
    
    case 'workflow_added': // Socket Event
    case 'workflow_changed': // Socket Event
      state = state.mergeIn(['tiles', action.payload.data]);
      break;
    case types.REMOVE_TILE:
    case 'workflow_removed': // Socket Event
      state = state.deleteIn(['tiles', action.payload.data.id]);
      break;
    case types.LOGOUT:{
      return initialState;
    }
  }
  if(state.get('tiles') !== oldState.get('tiles')){
    state = state.set('columns', fillTilesToColumns(state.get('columns'), state.get('tiles')))
  }
  return state;
}