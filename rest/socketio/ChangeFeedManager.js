"use strict";

let Promise = require('bluebird');

let ChangeFeedManager = (options) => {
  options = options || {};

  let _connections = [];

  let _start = (...args) => {
    return new Promise((resolve, reject) => {
      options.start(...args).then((connections) => {
        _connections = connections;

        return resolve();
      });
    })
  }

  let _stop = () => {
    _connections.forEach((connection) => {
      connection.close();
    })
  }

  return {
    stop: () => {
      _stop();
    },
    start: (...args) => {
      return _start(...args);
    },
    restart: () => {
      _stop();
      _start();
    }
  }
}

module.exports = ChangeFeedManager;
