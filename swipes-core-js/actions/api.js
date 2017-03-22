import * as types from '../constants/ActionTypes';

const handleUpdatesNeeded = (payload, state, dispatch) => {
  if (!payload) {
    return;
  }
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

export const request = (options, data) => (d, getState) => {
  const apiUrl = `${window.__API_URL__}/v1/`;
  let command;
  if (typeof options !== 'object') {
    command = `${options}`;
    options = null;
  }
  options = options || {};

  const body = Object.assign({}, {
    token: getState().getIn(['connection', 'token'])
  }, data);
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
  const extraHeaders = (window.getHeaders && window.getHeaders()) || {};

  const headers = new Headers({
    'Content-Type': 'application/json',
    ...extraHeaders,
    /*'sw-web-version': window.__VERSION__,
    'sw-electron-version': window.ipcListener.version,
    'sw-electron-arch': window.ipcListener.arch,
    'sw-platform': window.ipcListener.platform,*/
  });

  const serData = {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  };
  return new Promise((resolve, reject) => {
    console.log(apiUrl + command);
    fetch(apiUrl + command, serData)
    .then((r) => {
      if (r && r.ok) return r.json();
      return Promise.reject({ message: r.statusText, code: r.status });
    }).then((res) => {
      state = getState();
      handleUpdatesNeeded(res, state, d);

      if (res && res.ok) {
        d({
          type: command,
          payload: res,
        });
      } else {
        return Promise.reject({ message: res.error });
      }

        // Let's return a promise for convenience.
      resolve(res);
    }).catch((e) => {
      console.log('err', e);
      if (__DEV__) {
        console.warn(command, e);
      }
      resolve({ ok: false, error: e });
    });
  });
};

export const serviceRequest = (serviceName, method, parameters, stream) => {
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

export const serviceStream = (serviceName, method, parameters) =>
  serviceRequest(serviceName, method, parameters, true);
