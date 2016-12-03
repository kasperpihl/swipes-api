export default class APIConnector {
  constructor(baseUrl, token) {
    this._baseURL = baseUrl;
    this._apiUrl = `${baseUrl}/v1/`;
    this._token = token;
    this._apiQueue = [];
  }

  setToken(token) {
    this._token = token;
    this._apiQueue.forEach((r) => {
      this.request(r.options, r.data, r.callback);
    });
    this._apiQueue = [];
  }
  getToken() {
    return this._token;
  }
  getBaseURL() {
    return this._baseURL;
  }

  getAPIURL() {
    return this._apiUrl;
  }

  request(options, data, callback) {
    if (typeof options !== 'object') {
      options = { command: options };
    }

    if (!options.command) {
      throw new Error('SwipesAppSDK: request: command required');
    }

    if (!this._token && !options.force) {
      this._apiQueue.push({ options, data, callback });

      return;
    }
    // If no data is send, but only a callback set those
    if (typeof data === 'function') {
      callback = data;
    }

    const url = this._apiUrl + options.command;

    if ((data == null) || typeof data !== 'object') {
      data = {};
    }

    data.token = this._token;
    try {
      const serData = JSON.stringify(data);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.responseType = 'json';
      if (options.stream) {
        xhr.responseType = 'arraybuffer';
      }
      xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

      xhr.onload = (e) => {
        const res = e.currentTarget.response;
        if (typeof callback === 'function') {
          if (options.stream || (res && res.ok)) {
            callback(res);
          } else {
            callback(false, res);
            console.warn(`/${options.command} error`, res);
          }
        }
      };

      xhr.onerror = (e) => {
        let error = e; // T_TODO make sure that the `e` is actually the error
        console.warn(`/${options.command} error`, error);
        if (error.responseJSON) {
          error = error.responseJSON;
        }
        if (typeof callback === 'function') {
          callback(false, error);
        }
      };
      xhr.send(serData);
    } catch (e) {
      if (typeof callback === 'function') { callback(false, e); }
    }
  }
}
