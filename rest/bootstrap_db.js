"use strict";

const TEAM_ID = 'TSMFYIEKK';

let r = require('rethinkdb');
let util = require('./util.js');
let db = require('./db.js');
let Promise = require('bluebird'); // we should use native promises one day
let generateId = util.generateSlackLikeId;
let moment = require('moment');

let tables = ['users', 'teams', 'channels', 'messages', 'events', 'stars', 'apps'];
let indexes = {
  channels: 'name',
  users: 'email',
  users: 'name'
}
let teamDoc = {
  id: TEAM_ID,
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
        console.log('creating tables');

        let tablesCreateArray = [];

        tables.forEach(item => {
          let query = r.tableCreate(item);
          let promise = db.rethinkQuery(query);

          tablesCreateArray.push(promise);
        })

        Promise.all(tablesCreateArray).then(res => {
          console.log('creating indexes');

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
              createChannels();
              createApps();
            })
          })
        })
      })
  })


let createChannels = () => {
  console.log('creating some channels');

  let channels = [
    {
      id: generateId('C'),
      name: "general",
      type: "public",
      is_general: true,
      teamId: TEAM_ID,
      created: moment().unix()
    },
    {
      id: generateId('C'),
      name: "random",
      type: "public",
      teamId: TEAM_ID,
      created: moment().unix()
    }
  ]

  let query = r.table('channels').insert(channels);

  db.rethinkQuery(query).then(res => {
    console.log('DONE adding Channels');
  })
}

let createApps = () => {
  console.log('creating some apps');

  let apps = [
    {
      id: generateId('A'),
      "name": "Admin",
      "manifest_id": "admin",
      "version": "0.1",
      "description": "The Admin App For Swipes",
      admin_only: true
    }
  ];

  let insertQ = r.table('apps').insert(apps);

  db.rethinkQuery(insertQ).then(res => {
    console.log('DONE adding Apps');
  })
}
