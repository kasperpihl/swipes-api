import * as types from '../constants/ActionTypes'
import { request } from './apiActions'

export function renameTile(tile, name) {
  return request('users.renameWorkflow', { 'workflow_id': tile.id, name })
}
export function removeTile(tile) {
  return request('users.removeWorkflow', { 'workflow_id': tile.id})
}