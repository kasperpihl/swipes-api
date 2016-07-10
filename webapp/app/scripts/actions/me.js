import { request } from './api'

export function disconnectService(id) {
  return request('users.serviceDisconnect', {id});
}