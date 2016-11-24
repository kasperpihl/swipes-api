"use strict";

import req from 'request'

const request = ({ auth_data, method, params = {} }, callback) => {
  if (auth_data.access_token) {
    params.token = auth_data.access_token;
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
