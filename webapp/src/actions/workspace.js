import * as types from '../constants/ActionTypes'
import { request } from './api'

export function renameTile(tile, name) {
  return request('users.renameWorkflow', { 'workflow_id': tile.id, name })
}

export function addTile(tile){
  return { type: types.ADD_TILE, tile: tile };
}
export function removeTile(tileId){
  return { type: types.REMOVE_TILE, tileId };
}

export function selectAccount(id, accountId){
  return request('users.selectWorkflowAccountId', {'workflow_id': id, 'account_id': accountId});
}

export function generateShareUrl(data){
  return request('link.add', data);
}

export function saveData(tileId, obj, clear){
  try{

    const data = JSON.parse(JSON.stringify(obj.data));
    const options = obj.options
    return { type: types.TILE_SAVE_DATA, tileId, data, options};
  }
  catch(e){
    console.log('wrong data saved');
  }

}

export function updateColumns(columns){
  return { type: types.UPDATE_COLUMNS, columns: columns }
}
