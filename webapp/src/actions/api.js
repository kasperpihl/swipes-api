import { CALL_API } from 'redux-api-middleware';
import * as types from 'constants';

const apiUrl = `${window.location.origin}/v1/`;

const request = (options, data) => (dispatch, getState) => {
    // K_TODO: Validate types, check if types is second parameter etc.
  let command;
  if (typeof options !== 'object') {
    command = `${options}`;
    options = null;
  }
  options = options || {};

  const meta = Object.assign({ command }, options.meta);
  const reqTypes = [
    {
      type: types.API_REQUEST,
      meta,
    },
    types.API_SUCCESS,
    types.API_ERROR,
  ];

  const body = Object.assign({}, { token: getState().getIn(['main', 'token']) }, data);

  return dispatch({
    [CALL_API]: {
      endpoint: apiUrl + command,
      headers: { 'Content-Type': 'application/json' },
      types: reqTypes,
      method: 'POST',
      body: JSON.stringify(body),
    },
  }).then((res) => {
    command = options.resultAction || command;
      // Dispatch an action with the command as type
    if (res.error) {
      res.payload = Object.assign({}, res.payload.response, { ok: false });
    }
    if (res.payload.err && res.payload.err === 'not_authed') {
      dispatch({
        type: types.LOGOUT,
      });
      window.location.replace('/');
      return Promise.reject({ ok: false });
    }
    dispatch({
      type: command,
      payload: res.payload,
      meta: res.meta,
    });

      // Let's return a promise for convenience.
    return Promise.resolve(res.payload);
  }).catch(err => Promise.resolve(err));
};

const serviceRequest = (serviceName, method, parameters, stream) => {
  // console.log('args from actions', serviceName, method, parameters);
  const options = {
    service: serviceName,
    data: {
      method,
      parameters,
    },
  };
  const req = stream ? 'services.stream' : 'services.request';
  return request(req, options);
};

const serviceStream = (serviceName, method, parameters) =>
  serviceRequest(serviceName, method, parameters, true);

export {
  apiUrl,
  request,
  serviceRequest,
  serviceStream,
};
