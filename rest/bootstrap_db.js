"use strict";

let config = require('config');
let r = require('rethinkdb');
let util = require('./util.js');
let db = require('./db.js');
let Promise = require('bluebird'); // we should use native promises one day
let generateId = util.generateSlackLikeId;
let moment = require('moment');
let dbConfig = config.get('database');

require('rethinkdb-init')(r);

let tables = [
  {
    name: 'channels',
    indexes: ['name']
  },
  {
    name: 'users',
    indexes: ['name', 'email']
  },
  {
    name: 'messages',
    indexes: ['channel_id']
  },
  'events',
  'stars',
  'apps',
  'mentions'
];

r.init(dbConfig,
  tables
).then((conn) => {
  createChannels();
  createApps();
})


let createChannels = () => {
  console.log('creating some channels');

  let channels = [
    {
      id: generateId('C'),
      name: "general",
      type: "public",
      is_general: true,
      created: moment().unix()
    },
    {
      id: generateId('C'),
      name: "random",
      type: "public",
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
      admin_only: true,
      required: true,
      is_installed: true,
      main_app: {"index": "admin.html"}
    }
  ];

  let insertQ = r.table('apps').insert(apps);

  db.rethinkQuery(insertQ).then(res => {
    console.log('DONE adding Apps');
  })
}
