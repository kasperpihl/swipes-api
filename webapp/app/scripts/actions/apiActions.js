import { CALL_API } from 'redux-api-middleware'
import * as types from '../constants/ActionTypes'
const API_URL = window.location.origin + '/v1/'

export function request(options, data){
  return (dispatch, getState) => {
    // K_TODO: Validate types, check if types is second parameter etc.
    
    let command;
    if(typeof options !== 'object') {
      command = "" + options;
      options = null;
    }
    options = options || {}

    const meta = Object.assign({command: command}, options.meta);
    const reqTypes = [
      {
        type: types.API_REQUEST,
        meta: meta
      },
      types.API_SUCCESS, 
      types.API_ERROR
    ];

    const body = Object.assign({}, {token: getState().auth.token}, data);
    return dispatch({
      [CALL_API]: {
        endpoint: API_URL + command,
        headers: { 'Content-Type': 'application/json' },
        types: reqTypes,
        method: 'POST',
        body: JSON.stringify(body)
      }
    }).then((res) => {
      command = options.resultAction || command
      return dispatch({
        type: command,
        payload: res.payload,
        meta: res.meta
      })
    }).catch((err) => {
      console.log('api error', err);
    });
  }
  
} 