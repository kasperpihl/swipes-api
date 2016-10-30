import * as types from '../constants/ActionTypes'
import { fromJS, Map } from 'immutable'

const initialState = fromJS({ tiles : {
  'slack': {
    id: 'slack',
    name: 'Slack',
    required_services: ['slack']
  },
  'goals': {
    id: 'goals',
    name: 'Goals'
  }}, columns : [] });

function fillTilesToColumns(cols, tiles){
  let et = {};
  cols = cols.filter((c) => {
    const newRows = c.get('rows').filter( (r) => {
      et[r.get('id')] = true;
      return (tiles.get(r.get('id')));
    })
    c.set('rows', newRows);
    return newRows.size;
  });
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
    case 'rtm.start':{
      state = initialState;
      break;
    }
    case types.ADD_TILE:{
      state = state.setIn(['tiles', action.tile.id], fromJS(action.tile));
      break;
    }
    case types.REMOVE_TILE:{
      state = state.deleteIn(['tiles', action.tileId]);
      break;
    }
    case types.UPDATE_COLUMNS:{
      state = state.set('columns', fromJS(action.columns));
      break;
    }

    case types.LOGOUT:{
      return initialState;
    }
  }
  if(state.get('tiles') !== oldState.get('tiles')){
    state = state.set('columns', fillTilesToColumns(state.get('columns'), state.get('tiles')))
  }
  return state;
}
