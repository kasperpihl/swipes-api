import * as types from '../constants/ActionTypes'
import { request } from './api'

export function renameTile(tile, name) {
  return request('users.renameWorkflow', { 'workflow_id': tile.id, name })
}
export function removeTile(tile) {
  return request('users.removeWorkflow', { 'workflow_id': tile.id})
}

export function selectAccount(tile, accountId){
  return request('users.selectWorkflowAccountId', {'workflow_id': tile.id, 'account_id': accountId});
}