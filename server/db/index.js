import config from 'config';
import r from 'rethinkdb';
import Promise from 'bluebird';

let dbConfig = config.get('database');
const isCursor = (obj) => {
  // TODO: Suggest an r.isCursor() API or something similar.
  return obj != null && obj._conn != null;
};
const handleCursors = (results) => {
  return new Promise((resolve, reject) => {
    if (isCursor(results)) {
      return results.toArray()
        .then((array) => {
          // Clean up memory from the cursor
          results.close();

          return resolve(array);
        }).error((err) => {
          results.close();

          return reject(err);
        });
    }

    return resolve(results);
  });
};
const rethinkdb = {
  // options:
  // cursor: true/false(default) Most of the time we will
  // need just the results as array from the cursor
  // feed: true/false (to handle change feeds - don't close the connection)
  // returnConnection: return the cursor and the connection in an array
  // dbConfig: pass a config object for connection to the db
  rethinkQuery: (query, options = {}) => {
    return new Promise((resolve, reject) => {
      let conn;

      if (options.dbConfig) {
        dbConfig = options.dbConfig;
      }

      r.connect(dbConfig).then((localConn) => {
        conn = localConn;

        return query.run(conn);
      }).then((cursor) => {
        if (!options.feed) {
          conn.close();
        }

        if (options.cursor || options.feed) {
          if (options.feed) {
            if (options.socket) {
              options.socket.on('close', () => {
                conn.close({ noreplyWait: false });
              });
            }

            if (options.returnConnection) {
              return resolve([cursor, conn]);
            }

            return resolve(cursor);
          }

          return resolve(cursor);
        }

        return handleCursors(cursor)
          .then((results) => {
            if (results.errors > 0) {
              // From rethinkdb docs
              // first_error: If errors were encountered, contains the text of the first error
              return reject(results.first_error);
            }

            return resolve(results);
          }).error((err) => {
            return reject(err);
          });
      }).error((err) => {
        return reject(err);
      });
    });
  },
};

module.exports = rethinkdb;
