"use strict";

const TEAM_ID = process.env.TEAM_ID;

let r = require('rethinkdb');
let db = require('../db.js');
let fs = require('fs');
let Promise = require('bluebird');
let jsonToQuery = require('../json_to_query.js').jsonToQuery;
let util = require('../util.js');
// relative directory to installed apps
let appDir = __dirname + '/../../apps/';
let ChangeFeedManager = require('./ChangeFeedManager.js');

let getAppFile = (appId, fileName) => {
  let file;

  try {
    let dest = appDir + appId + '/' + fileName;

    file = fs.readFileSync(dest, 'utf8');
  } catch (err) {
    console.log(err);
    file = null;
  }

  return file;
}

// let scopeCheck = (userId, scope) => {
//   let scopeType;
//   let matchScopeQ = r.table('users')
//
//   if (scope.charAt(0) === 'A') {
//     scopeType = 'apps'
//   }
//
//   if (scope.charAt(0) === 'C') {
//     scopeType = 'channels'
//   }
//
//   if(scopeType){
//     matchScopeQ = matchScopeQ.get(userId)(scopeType).filter({id: scope}).count()
//   }
//   else{
//     // If no scope type, assume that it is just the user
//     matchScopeQ = matchScopeQ.filter({id: scope}).count()
//   }
//
//   return matchScopeQ;
// }

let emitEvents = (cursor, socket, eventType) => {
  cursor.each((err, row) => {
    if (err) {
      console.log(err);
      // T_TODO how to handle erros here?!
      return;
    }

    let data = row.new_val;

    socket.emit('message', {type: eventType, data: data});
  })
}

let hook = (socket, userId) => {
  let start = (userScope) => {
    return new Promise((resolve, reject) => {
      let listAppsQ =
        r.table("users")
          .get(userId)("apps")
          .eqJoin("id", r.table('apps'))
          .zip()
          .withFields("id", "manifest_id")

      db.rethinkQuery(listAppsQ)
        .then((apps) => {
          let changesPromises = [];
          let tableName;

          apps.forEach((app) => {
            let manifest = JSON.parse(getAppFile(app.manifest_id, 'manifest.json'));

            if (manifest && manifest.listenTo && manifest.listenTo.length > 0) {
              manifest.listenTo.forEach((item) => {
                tableName = util.appTable(app.manifest_id, item.table);

                item.table = tableName;

                let changesQ = jsonToQuery(item, {feed: true});

                changesQ = changesQ.filter((doc) => {
                  return r.expr(userScope).contains(doc('scope'));
                }).changes();

                changesPromises.push(db.rethinkQuery(changesQ, {feed: true, returnConnection: true}));
              })
            }
          })

          Promise.all(changesPromises).then((feeds) => {
            let connections = [];

            feeds.forEach((feed) => {
              let cursor = feed[0];

              connections.push(feed[1]);
              emitEvents(cursor, socket, tableName);
            })

            return resolve(connections);
          }).catch((err) => {
            console.log(err)
          });
        }).catch((err) => {
          console.log("caught there", err);
          return reject(err);
        });
    });
  }

  return ChangeFeedManager({start: start});
}

let adminApps = (socket, userId) => {
  let listenQ = r.table('apps').changes();

  db.rethinkQuery(listenQ, {feed: true})
    .then((cursor) => {
      cursor.each((err, row) => {
        if (err) {
          console.log(err);
          // T_TODO how to handle erros here?!
          // Sending error message on the socket?
          return;
        }

        let type;
        let data;

        if (!row.old_val || row.new_val.is_installed === true) {
          type = 'app_installed';
          data = row.new_val;
        }

        if (row.new_val && row.new_val.is_installed === false) {
          type = 'app_uninstalled';
          data = {
            id: row.new_val.id
          };
        }

        if (row.new_val && row.new_val.deleted) {
          type = 'app_deleted';
          data = {
            id: row.new_val.id
          };
        }

        socket.emit('message', {type: type, data: data});
      })
    })
}

module.exports = {
  hook: hook,
  adminApps: adminApps
}
