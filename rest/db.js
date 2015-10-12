var r = require('rethinkdb');
var Promise = require('bluebird');

var isCursor = function(obj) {
  // TODO: Suggest an r.isCursor() API or something similar.
  return obj != null && obj._conn != null;
}

var handleCursors = function (results) {
  return new Promise(function (resolve, reject) {
    if (isCursor(results)) {
      results.toArray()
        .then(function (array) {
          // Clean up memory from the cursor
          results.close();

          return resolve(array);
        }).error(function () {
          results.close();

          return reject(err);
        });
    } else {
      return resolve(results);
    }
  });
}

var rethinkdb = {
  // options:
  //      cursor: true/false(default) Most of the time we will need just the results as array from the cursor
  rethinkQuery: function (query, options) {
    var options = options || {};

    return new Promise(function (resolve, reject) {
      r.connect({host: 'localhost', port: 28015, db: 'swipes' })
        .then(function (conn) {
          query.run(conn)
            .then(function (results) {
              conn.close();

              if (options.cursor) {
                return resolve(results);
              } else {
                handleCursors(results)
                  .then(function (results) {
                    return resolve(results);
                  }).error(function (err) {
                    return reject(err);
                  });
              }
            }).error(function (err) {
              conn.close();

              return reject(err);
            });
        }).error(function (err) {
          return reject(err);
        });
    });
  }
}

module.exports = rethinkdb;
