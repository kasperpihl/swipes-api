"use strict";

const TEAM_ID = process.env.TEAM_ID;

let r = require('rethinkdb');
let db = require('../db.js');
let fs = require('fs');
let jsonToQuery = require('../json_to_query.js').jsonToQuery;
let util = require('../util.js');
// relative directory to installed apps
let appDir = __dirname + '/../../apps/';

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

module.exports.hook = (socket, userId) => {
  console.log('^..^');
  let listAppsQ =
    r.table("users")
      .get(userId)("apps")
      .eqJoin("id", r.table('apps'))
      .zip()
      .withFields("id", "manifest_id")

  db.rethinkQuery(listAppsQ)
    .then((apps) => {
      apps.forEach((app) => {
        let manifest = JSON.parse(getAppFile(app.manifest_id, 'manifest.json'));

        if (manifest && manifest.listenTo && manifest.listenTo.length > 0) {
          manifest.listenTo.forEach((item) => {
            let tableName = util.appTable(app.id, item.table);

            item.table = tableName;

            let changesQ = jsonToQuery(item, {feed: true});

            changesQ = changesQ.changes();

            db.rethinkQuery(changesQ, {feed: true})
              .then((cursor) => {
                cursor.each((err, row) => {
                  if (err) {
                    console.log(err);
                    // T_TODO how to handle erros here?!
                    return;
                  }

                  let type = tableName;
                  let data = row.new_val;

                  socket.emit('message', {type: type, data: data});
                })
              })
          })
        }
      })
    }).catch((err) => {
      console.log(err);
      return;
    });
}
