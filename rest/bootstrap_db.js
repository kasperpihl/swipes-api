"use strict";

const TEAM_ID = 'TSMFYIEKK';

let r = require('rethinkdb');
let util = require('./util.js');
let db = require('./db.js');
let Promise = require('bluebird'); // we should use native promises one day
let generateId = util.generateSlackLikeId;
let moment = require('moment');

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
  'teams',
  'messages',
  'events',
  'stars',
  'apps'
];

let teamDoc = {
  id: TEAM_ID,
  name: 'Swipes HQ',
  parent: null,
  users: [],
  channels: []
};

r.init({
    host: 'localhost',
    port: 28015,
    db: 'swipes'
  },
  tables
).then((conn) => {
  let query = r.table('teams').insert(teamDoc);

  db.rethinkQuery(query).then(res => {
    createChannels();
    createApps();
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
      admin_only: true,
      required: true,
      is_installed: true,
      has_main_app: true
    }
  ];

  let insertQ = r.table('apps').insert(apps);

  db.rethinkQuery(insertQ).then(res => {
    console.log('DONE adding Apps');
  })
}
