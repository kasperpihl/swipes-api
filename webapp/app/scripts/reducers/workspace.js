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
  let tiles, columns;
  switch(action.type){
    case ('rtm.start'):{
      const res = action.payload;
      if(res.ok){
        tiles = {}
        res.workflows.forEach((tile) => {
          tiles[tile.id] = tile;
        })
      }
      break;
    }
    case types.SOCKET_MESSAGE:{
      const msg = action.payload;
      switch(msg.type){
        case 'workflow_added':
        case 'workflow_changed':
          const combinedData = Object.assign({}, state.tiles[msg.data.id], msg.data);
          tiles = Object.assign({}, state.tiles, {[msg.data.id]: combinedData});
          break;
        case 'workflow_removed':
          tiles = Object.assign({}, state.tiles);
          delete tiles[msg.data.id];
          break;
      }
      break;
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