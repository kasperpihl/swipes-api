import { request } from './apiActions'

export function disconnectService(id) {
  return request('users.serviceDisconnect', {id});
}