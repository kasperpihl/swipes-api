"use strict";

let config = require('config');
let randomstring = require('randomstring');
let moment = require('moment');

let randomNumber = (length) => {
  let number = randomstring.generate({
    length: length,
    charset: 'numeric'
  });

  return number;
}

let util = {
  // type is one of the slack types [U, C, G]
  // U for user
  // C for channel
  // G for group
  generateSlackLikeId: (type) => {
    type = type.toUpperCase();
    let id = randomstring.generate(8).toUpperCase();

    return type + id;
  },
  generateSlackLikeTs: () => {
    let rNumber = randomNumber(3);
    let ts = moment().valueOf() + rNumber;

    return ts.substring(0,ts.length - 6) + "." + ts.substring(ts.length - 6);
  },
  // suports only objects for now
  isEmpty: (obj) => {
    return Object.keys(obj).length === 0;
  },
  appTable: (appId, table) => {
    return appId + '_' + table;
  },
  appUrl: (req, app) => {
    let hostUrl = config.get('protocol') + req.hostname + ':' + config.get('port');
    let getString = '/v1/apps.load?app_id=' + app.id + '&manifest_id=' + app.manifest_id + '&token=' + req.body.token;

    return hostUrl + getString;
  }
};

module.exports = util;
