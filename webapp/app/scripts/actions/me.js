import { request } from './api'

export function disconnectService(id) {
  return request('users.serviceDisconnect', {id});
}

export default function handleOAuthSuccess(serviceName, query){
  if(typeof query === "string"){
    query = JSON.parse(query);
  }
  const options = {
    service: serviceName,
    data: query
  };
  return request('services.authsuccess', options);
}