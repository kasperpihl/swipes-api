import { CALL_API } from 'redux-api-middleware';
import * as types from 'constants';
import * as a from 'actions';

const apiUrl = `${window.location.origin}/v1/`;
const handleUpdatesNeeded = (payload, state, dispatch) => {
  const updateRequired = state.getIn(['main', 'versionInfo', 'updateRequired']);
  const updateAvailable = state.getIn(['main', 'versionInfo', 'updateAvailable']);
  const updateUrl = state.getIn(['main', 'versionInfo', 'updateUrl']);
  const reloadAvailable = state.getIn(['main', 'versionInfo', 'reloadAvailable']);
  const reloadRequired = state.getIn(['main', 'versionInfo', 'reloadRequired']);

  if (
    payload.update_required !== updateRequired ||
    payload.update_available !== updateAvailable ||
    payload.update_url !== updateUrl ||
    payload.reload_required !== reloadRequired ||
    payload.reload_available !== reloadAvailable
  ) {
    dispatch({
      type: types.SET_UPDATE_STATUS,
      payload: {
        updateRequired: payload.update_required,
        updateAvailable: payload.update_available,
        updateUrl: payload.update_url,
        reloadRequired: payload.reload_required,
        reloadAvailable: payload.reload_available,
      },
    });
  }
};
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

  const body = Object.assign({}, { token: getState().getIn(['connection', 'token']) }, data);
  let state = getState();
  const updateRequired = state.getIn(['main', 'versionInfo', 'updateRequired']);
  const reloadRequired = state.getIn(['main', 'versionInfo', 'reloadRequired']);
  if (updateRequired || reloadRequired) {
    return Promise.resolve({
      ok: false,
      update_required: updateRequired,
      reload_required: reloadRequired,
    });
  }
  return dispatch({
    [CALL_API]: {
      endpoint: apiUrl + command,
      headers: {
        'Content-Type': 'application/json',
        'sw-web-version': window.__VERSION__,
        'sw-electron-version': window.ipcListener.version,
        'sw-electron-arch': window.ipcListener.arch,
        'sw-platform': window.ipcListener.platform,
      },
      types: reqTypes,
      method: 'POST',
      body: JSON.stringify(body),
    },
  }).then((res) => {
    state = getState();

    command = options.resultAction || command;
      // Dispatch an action with the command as type
    if (res.error) {
      res.payload = Object.assign({}, res.payload.response, { data }, { ok: false });
    }
    if (res.payload.err && res.payload.err === 'not_authed') {
      dispatch(a.main.forceLogout);
      return Promise.reject({ ok: false, err: 'not_authed' });
    }
    handleUpdatesNeeded(res.payload, state, dispatch);

    if (res.payload && res.payload.ok) {
      dispatch({
        type: command,
        payload: res.payload,
        meta: res.meta,
      });
    } else if (process.env.NODE_ENV !== 'production') {
      console.warn(command, res.payload);
    }

      // Let's return a promise for convenience.
    return Promise.resolve(res.payload);
  }).catch(err => Promise.resolve({ err, data }));
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
