import * as types from '../constants/ActionTypes'
import clone from 'clone'
const initialState = { tiles : {}, columns : [] };

function tiles (state, action){
  
}
function addRowToColumns(columns, row){
  
}
function fillTilesToColumns(columns, tiles){
  let existingTiles = {};
  // Filter out any tiles not in the workspace any more
  columns = columns.filter((column) => {
    column.rows = column.rows.filter((row) => {
      if(tiles[row.id]){
        existingTiles[row.id] = true;
        return true;
      }
      return false; 
    })
    return (column.rows.length)
  })

  for( let key in tiles ){
    if(!existingTiles[key]){
      columns = [...columns, {rows: [{ id: key }] }];
    }
  }
  return columns;
}

export default function workspace (state = initialState, action) {
  let tiles, columns, msg;
  switch(action.type){
    case types.UPDATE_COLUMNS:{
      columns = action.columns;
      break;
    }

    case types.TILE_SAVE_DATA: {
      tiles = clone(state.tiles);
      if(action.options){
        tiles[action.tileId].data = null;
      }
      tiles[action.tileId].data = Object.assign({}, tiles[action.tileId].data, action.data);
      break;
    }

    case ('rtm.start'):{ // API Request
      const res = action.payload;
      if(res.ok){
        tiles = clone(state.tiles);
        res.workflows.forEach((tile) => {
          tiles[tile.id] = Object.assign({}, tiles[tile.id], tile);
        })
      }
      break;
    }
    
    case 'workflow_added': // Socket Event
    case 'workflow_changed': // Socket Event
      msg = action.payload;
      tiles = clone(state.tiles);
      tiles[msg.data.id] = Object.assign({}, tiles[msg.data.id], msg.data);
      break;
    case 'workflow_removed': // Socket Event
      msg = action.payload;
      tiles = clone(state.tiles);
      delete tiles[msg.data.id];
      break;
    
    case types.LOGOUT:{
      return clone(initialState);
    }
  }

  if(!tiles && !columns){
    return state;
  }
  columns = columns || state.columns;
  if(tiles){
    columns = fillTilesToColumns(columns, tiles);
  }
  tiles = tiles || state.tiles;
  

  return {tiles, columns}
}