"use strict";

let r = require('rethinkdb');
let util = require('./util.js');
let db = require('./db.js');
let Promise = require('bluebird'); // we should use native promises one day

let tables = ['users', 'teams', 'channels', 'messages'];
let indexes = {
  channels: 'name',
  users: 'email'
}
let teamDoc = {
  id: 'TSMFYIEKK',
  name: 'Swipes HQ',
  parent: null,
  users: [],
  channels: []
}

r.connect({host: 'localhost', port: 28015 })
  .then(conn => {
    r.dbCreate('swipes').run(conn)
      .then(res => {
        conn.close();

        let tablesCreateArray = [];

        tables.forEach(item => {
          let query = r.tableCreate(item);
          let promise = db.rethinkQuery(query);

          tablesCreateArray.push(promise);
        })

        Promise.all(tablesCreateArray).then(res => {
          let tablesCreateIndexArray = [];

          Object.keys(indexes).forEach(key => {
            let val = indexes[key];
            let query = r.table(key).indexCreate(val);
            let promise = db.rethinkQuery(query);

            tablesCreateIndexArray.push(promise);
          })

          Promise.all(tablesCreateIndexArray).then(res => {
            let query = r.table('teams').insert(teamDoc);

            db.rethinkQuery(query).then(res => {
              console.log('DONE');
            })
          })
        })
      })
  })
