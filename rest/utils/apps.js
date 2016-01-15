"use strict";

let r = require('rethinkdb');
let util = require('../util.js');
let db = require('../db.js');
let Promise = require('bluebird');

let appDir = __dirname + '/../../apps/';

let callAppMethod = (manifestId, method, data) => {
  // T_TODO do we really need that?
  // T_ANSWER Yes we do. Anything less would be bad practice, since we're relying on external API's.
  let methodTimeout = 15000;

  return new Promise((resolve, reject) => {
    let getAppQ = r.table('apps').filter({manifest_id: manifestId});

    db.rethinkQuery(getAppQ).then((apps) => {
      if (!apps.length) {
        return resolve({err: 'app_not_found'});
      }

      let app = apps[0];

      let manifest = JSON.parse(util.getFile(appDir + app.manifest_id + '/manifest.json'));

      if (!manifest) {
        return resolve({err: 'no_manifest_found'});
      }

      if(!manifest.background){
        return resolve({err: 'manifest_no_background_defined'});
      }

      // Check if app has background script setup
      let background = require(appDir + manifest.identifier + "/" + manifest.background);

      if (!background) {
        return resolve({err: 'background_script_not_found'});
      }

      if(!background.methods || !background.methods[method] || typeof background.methods[method] !== 'function'){
        return resolve({err: 'method_not_found'});
      }

      let didReturn = false;

      let timer = setTimeout(() => {
        didReturn = true;
        return resolve({err: 'method_timedout'});
      }, methodTimeout);

      background.methods[method](data, (error, result) => {
        clearTimeout(timer);

        if (didReturn) {
          return;
        }

        if (error) {
          // T_TODO maybe return the error object too
          // or create some convention for app method to return errors
          // in a structured way
          return resolve({err: 'method_error'});
        }

        return resolve({res: result});
      });
    })
    .catch((err) => {
      // T_TODO maybe we want to resolve this error not to use reject
      // we log the error from the db and show another error to the users
      // without breaking the promise chain.
      return reject(err);
    })
  });
}

module.exports = {
  callAppMethod: callAppMethod
};
