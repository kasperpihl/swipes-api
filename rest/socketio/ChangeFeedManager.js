"use strict";

let Promise = require('bluebird');

let ChangeFeedManager = (options) => {
  options = options || {};

  let _connections = [];

  let _start = () => {
    return new Promise((resolve, reject) => {
      options.start().then((connections) => {
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
    start: () => {
      return _start();
    },
    restart: () => {
      _stop();
      _start();
    }
  }
}

module.exports = ChangeFeedManager;
