"use strict";

const TEAM_ID = process.env.TEAM_ID;

let r = require('rethinkdb');
let db = require('../db.js');
let fs = require('fs');
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
  let listAppsQ = r.table('apps').filter({is_active: true});

  db.rethinkQuery(listAppsQ)
    .then((apps) => {
      apps.forEach((app) => {
        let manifest = JSON.parse(getAppFile(app.id, 'manifest.json'));

        if (manifest && manifest.listenTo && manifest.listenTo.length > 0) {
          console.log(manifest.listenTo);
          manifest.listenTo.forEach((item) => {
            let table = app.id + '_' + item;
            let changesQ = r.table(table).changes()

            db.rethinkQuery(changesQ, {feed: true})
              .then((cursor) => {
                cursor.each((err, row) => {
                  if (err) {
                    console.log(err);
                    // T_TODO how to handle erros here?!
                    return;
                  }

                  let type = table;
                  let data = {
                    old: row.old_val,
                    new: row.new_val
                  }

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
