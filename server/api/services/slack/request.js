"use strict";

import req from 'request'

const request = ({ authData, method, params = {} }, callback) => {
  if (authData.access_token) {
    params.token = authData.access_token;
  }

  const options = {
    method: 'post',
    form: params,
    json: true,
    url: 'https://slack.com/api/' + method.toLowerCase(),
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  }

  req(options, (err, res, body) => {
    if (err) {
      console.log(err);
      return callback(err);
    }

    return callback(null, body);
  });
}

export {
  request
}
