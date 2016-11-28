"use strict";

import req from 'request';
import {
  mapApiMethod
} from './api_map';

const request = ({ auth_data, method, params = {} }, callback) => {
  const url =
    auth_data.access_token ?
    'https://api.dropboxapi.com/2' :
    'https://api.dropboxapi.com/oauth2';
  const mappedMethod = mapApiMethod(method);

  const options = {
    method: 'post',
    json: true,
    url: url + mappedMethod,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  }

  if (auth_data.access_token) {
    options.body = params;
    options.headers['Authorization'] = 'Bearer ' + auth_data.access_token;
  } else {
    options.form = params;
  }

  req(options, (err, res, body) => {
    if (err) {
      console.log(err);
      return callback(err);
    }

    return callback(null, body);
  });
}

const shareRequest = ({ auth_data, type, itemId, user }, callback) => {
  let method = '';
  let params = {};

  if (type === 'file') {
    method = 'files.getMetadata';
    params = Object.assign({}, {
      path: itemId
    })
  } else {
    return callback('This type is not supported :/');
  }

  request({ auth_data, method, params, user }, (err, res) => {
    if (err) {
      return callback(err);
    }

    const serviceActions = cardActions(type, res);
    const serviceData = cardData(type, res);
    const meta = Object.assign({}, serviceData, serviceActions);

    return callback(null, { meta });
  })
}

const cardData = (type, data) => {
  let mappedData;

  if (type === 'file') {
    let subtitle = data.path_display || '';

    if (subtitle.length > 0) {
      subtitle = subtitle.split('/').slice(0, -1).join('/');
    }

    mappedData = {
      title: data.name || '',
      subtitle
    }
  }

  return mappedData;
}

const cardActions = (type, data) => {
  // Dummy for now
  return [];
}

export {
  request,
  shareRequest
}
