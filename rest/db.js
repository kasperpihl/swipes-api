"use strict";

let config = require('config');
let r = require('rethinkdb');
let Promise = require('bluebird');

let dbConfig = config.get('dbConfig');
if(process.env.DB_HOST){
  dbConfig = {
    host: process.env.DB_HOST,
    port: dbConfig.port,
    db: 'swipes'
  };
}
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
  //      feed: true/false (to handle change feeds - don't close the connection)
  //      returnConnection: return the cursor and the connection in an array
  rethinkQuery: (query, options) => {
    options = options || {};

    return new Promise((resolve, reject) => {
      let conn;

      r.connect(dbConfig).then((localConn) => {
        conn = localConn;

        return query.run(conn);
      }).then((results) => {

        if (!options.feed) {
          conn.close();
        }

        if (options.cursor || options.feed) {
          if (options.socket) {
            options.socket.on('disconnect', () => {
              results.close();
              conn.close();
            });
          }

          if (options.returnConnection) {
            return resolve([results, conn]);
          } else {
            return resolve(results);
          }
        } else {
          handleCursors(results)
            .then((results) => {
              return resolve(results);
            }).error((err) => {
              return reject(err);
            });
        }
      }).error((err) => {
        return reject(err);
      });
    });
  }
}

module.exports = rethinkdb;
