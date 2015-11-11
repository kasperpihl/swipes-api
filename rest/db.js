"use strict";

let config = require('config');
let r = require('rethinkdb');
let Promise = require('bluebird');

let dbConfig = config.get('dbConfig');
if(process.env.DB_HOST)
  dbConfig.host = process.env.DB_HOST;
let isCursor = (obj) => {
  // TODO: Suggest an r.isCursor() API or something similar.
  return obj != null && obj._conn != null;
}

let handleCursors = (results) => {
  return new Promise((resolve, reject) => {
    if (isCursor(results)) {
      results.toArray()
        .then((array) => {
          // Clean up memory from the cursor
          results.close();

          return resolve(array);
        }).error((err) => {
          results.close();

          return reject(err);
        });
    } else {
      return resolve(results);
    }
  });
}

let rethinkdb = {
  // options:
  //      cursor: true/false(default) Most of the time we will need just the results as array from the cursor
  rethinkQuery: (query, options) => {
    options = options || {};

    return new Promise((resolve, reject) => {
      r.connect(dbConfig)
        .then((conn) => {
          query.run(conn)
            .then((results) => {
              if (!options.feed) {
                conn.close();
              }

              if (options.cursor || options.feed) {
                return resolve(results);
              } else {
                handleCursors(results)
                  .then((results) => {
                    return resolve(results);
                  }).error((err) => {
                    return reject(err);
                  });
              }
            }).error((err) => {
              conn.close();

              return reject(err);
            });
        }).error((err) => {
          return reject(err);
        });
    });
  }
}

module.exports = rethinkdb;
