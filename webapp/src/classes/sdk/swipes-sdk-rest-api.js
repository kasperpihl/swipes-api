
export default class SwipesAPIConnector {
  constructor(baseUrl, token) {

    this._baseURL = baseUrl;
    this._apiUrl = baseUrl + '/v1/';
    this._token = token;
    this._apiQueue = [];

  }

  setToken(token) {
    this._token = token;
    this._apiQueue.forEach( (r) => {
      this.request(r.options, r.data, r.callback);
    })
    this._apiQueue = [];
  };
  getToken() {
    return this._token;
  }
  getBaseURL() {
    return this._baseURL;
  }

  getAPIURL() {
    return this._apiUrl;
  };

  request(options, data, callback) {
    if(typeof options !== 'object') {
      options = {command: options};
    }

    if(!options.command){
      throw new Error('SwipesAppSDK: request: command required');
    }

    if (!this._token && !options.force) {
      this._apiQueue.push({options: options, data: data, callback: callback});

      return;
    }
    // If no data is send, but only a callback set those
    if (typeof data === 'function') {
      callback = data;
    }

    var url = this._apiUrl + options.command;

    if ((data == null) || typeof data !== 'object') {
      data = {};
    }

    data.token = this._token;
    try{
      var serData = JSON.stringify(data);

      var xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.responseType = 'json'
      if(options.stream){
        xhr.responseType = 'arraybuffer';
      }
      xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

      xhr.onload = function(e) {
        var data = e.currentTarget.response;
        console.log('/' + options.command + ' success', data);
        if(typeof callback === 'function'){
          if(options.stream || (data && data.ok)){
            callback(data)
          }
          else{
            callback(false, data)
          }
        }
      };

      xhr.onerror = function(e) {
        var error = e; //T_TODO make sure that the `e` is actually the error
        console.log('/' + options.command + ' error', error);
        if(error.responseJSON)
          error = error.responseJSON;
        if(typeof callback === 'function')
          callback(false, error);
      };
      xhr.send(serData);
    }
    catch(e){
      if(typeof callback === 'function')
        callback(false, e);
    }
    
  }
}
