"use strict";

let config = require('config');
let randomstring = require('randomstring');
let moment = require('moment');
let fs = require('fs');

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
  appUrl: (req, app, type) => {
    let hostUrl = config.get('protocol') + req.hostname + ':' + config.get('port');
    let getString;
    if(app[type].index)
      getString = '/apps/' + app.manifest_id + '/' + app[type].index;

    return hostUrl + getString;
  },
  getAppFile: (dest) => {
    let file;

    try {
      file = fs.readFileSync(dest, 'utf8');
    } catch (err) {
      console.log(err);
      file = null;
    }

    return file;
  }
};

module.exports = util;
