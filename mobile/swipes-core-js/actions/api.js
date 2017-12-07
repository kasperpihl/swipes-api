import * as types from '../constants';

const handleUpdatesNeeded = (payload, state, dispatch) => {
  if (!payload) {
    return;
  }
  const updateRequired = state.getIn(['connection', 'versionInfo', 'updateRequired']);
  const updateAvailable = state.getIn(['connection', 'versionInfo', 'updateAvailable']);
  const updateUrl = state.getIn(['connection', 'versionInfo', 'updateUrl']);
  const reloadAvailable = state.getIn(['connection', 'versionInfo', 'reloadAvailable']);
  const reloadRequired = state.getIn(['connection', 'versionInfo', 'reloadRequired']);
  const maintenance = state.getIn(['connection', 'versionInfo', 'maintenance']);

  if (
    payload.update_required !== updateRequired ||
    payload.update_available !== updateAvailable ||
    payload.update_url !== updateUrl ||
    payload.reload_required !== reloadRequired ||
    payload.reload_available !== reloadAvailable ||
    payload.maintenance !== maintenance
  ) {
    dispatch({
      type: types.SET_UPDATE_STATUS,
      payload: {
        maintenance: payload.maintenance,
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
  const apiUrl = `${getState().getIn(['globals', 'apiUrl'])}/v1/`;
  let command;
  if (typeof options !== 'object') {
    command = `${options}`;
    options = null;
  } else {
    command = options.command;
  }

  options = options || {};

  let body = Object.assign({}, {
    token: getState().getIn(['connection', 'token']),
  }, data);
  let state = getState();
  const updateRequired = state.getIn(['connection', 'versionInfo', 'updateRequired']);
  const reloadRequired = state.getIn(['connection', 'versionInfo', 'reloadRequired']);
  if (updateRequired || reloadRequired) {
    return Promise.resolve({
      ok: false,
      update_required: updateRequired,
      reload_required: reloadRequired,
    });
  }
  const apiHeaders = getState().getIn(['globals', 'apiHeaders']);
  const extraHeaders = (apiHeaders && apiHeaders.toJS()) || {};

  const headers = new Headers({
    ...extraHeaders,
  });

  if (!options.formData) {
    body = JSON.stringify(body);
    headers.append('Content-Type', 'application/json');
  } else {
    const values = Object.entries(body);
    body = new FormData();
    values.forEach(([k, v]) => {
      body.append(k, v);
    })
  }

  const serData = {
    method: 'POST',
    headers,
    body,
  };
  let redirectUrl;
  return new Promise((resolve, reject) => {
    fetch(apiUrl + command, serData)
      .then((r) => {
        if(r && r.url && !apiUrl.startWith('https://staging') && r.url.startsWith('https://staging')) {
          redirectUrl = r.url;
        }
        if (r && r.ok) return r.json();
        return Promise.reject({ message: r.statusText, code: r.status });
      }).then((res) => {
        state = getState();
        handleUpdatesNeeded(res, state, d);
        if (res && res.ok) {
          if(redirectUrl) {
            res.redirectUrl = redirectUrl;
          }
          d({
            type: command,
            payload: res,
          });
        } else {

          if (res.error === 'not_authed') {
            d({ type: types.RESET_STATE });
          }
          return Promise.reject({ message: res.error });
        }

        // Let's return a promise for convenience.
        resolve(res);
      }).catch((e) => {
        console.log(JSON.stringify(e));
        if (getState().getIn(['globals', 'isDev'])) {
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
