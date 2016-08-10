import * as types from '../constants/ActionTypes'

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

    case ('rtm.start'):{ // API Request
      const res = action.payload;
      if(res.ok){
        tiles = {}
        res.workflows.forEach((tile) => {
          tiles[tile.id] = tile;
        })
      }
      break;
    }

    case 'workflow_added': // Socket Event
    case 'workflow_changed': // Socket Event
      msg = action.payload;
      const combinedData = Object.assign({}, state.tiles[msg.data.id], msg.data);
      tiles = Object.assign({}, state.tiles, {[msg.data.id]: combinedData});
      break;
    case 'workflow_removed': // Socket Event
      msg = action.payload;
      tiles = Object.assign({}, state.tiles);
      delete tiles[msg.data.id];
      break;
    
    
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