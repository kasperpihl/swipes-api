import config from 'config';
import r from 'rethinkdb';

let dbConfig = config.get('database');
const isCursor = obj => {
  // TODO: Suggest an r.isCursor() API or something similar.
  return obj != null && obj._conn != null;
};
const handleCursors = (results, conn) => {
  return new Promise((resolve, reject) => {
    if (isCursor(results)) {
      return results
        .toArray()
        .then(array => {
          // Clean up memory from the cursor
          results.close();

          return conn.close().then(() => {
            return resolve(array);
          });
        })
        .error(err => {
          results.close();

          return conn.close().then(() => {
            return reject(err);
          });
        });
    }

    return conn.close().then(() => {
      return resolve(results);
    });
  });
};
// options:
// cursor: true/false(default) Most of the time we will
// need just the results as array from the cursor
// feed: true/false (to handle change feeds - don't close the connection)
// returnConnection: return the cursor and the connection in an array
// dbConfig: pass a config object for connection to the db
export default (query, options = {}) =>
  new Promise((resolve, reject) => {
    let conn = null;

    if (options.dbConfig) {
      dbConfig = options.dbConfig;
    }

    return r
      .connect(dbConfig)
      .then(localConn => {
        conn = localConn;

        return query.run(conn);
      })
      .then(cursor => {
        if (options.cursor) {
          return conn.close().then(() => {
            return resolve(cursor);
          });
        }

        if (options.feed) {
          if (options.socket) {
            options.socket.on('close', () => {
              conn.close({ noreplyWait: false });
            });
          }

          if (options.returnConnection) {
            return resolve([cursor, conn]);
          }

          return resolve(cursor, conn);
        }

        return handleCursors(cursor, conn)
          .then(results => {
            if (results.errors > 0) {
              // From rethinkdb docs
              // first_error: If errors were encountered, contains the text of the first error
              return reject(results.first_error);
            }

            return resolve(results);
          })
          .catch(err => {
            return reject(err);
          });
      })
      .catch(err => {
        return reject(err);
      });
  });
