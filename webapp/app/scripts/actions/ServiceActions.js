import * as types from '../constants/ActionTypes'
import { request } from './apiActions'

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