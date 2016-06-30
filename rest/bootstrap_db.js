"use strict";

let config = require('config');
let r = require('rethinkdb');
let db = require('./db.js');
let dbConfig = config.get('database');

require('rethinkdb-init')(r);

let tables = [
  {
    name: 'users',
    indexes: ['name', 'email']
  },
  {
    name: 'services',
    indexes: ['manifest_id']
  },
  {
    name: 'workflows',
    indexes: ['manifest_id']
  },
  {
    name: 'links',
    indexes: ['checksum', 'short_url']
  },
  'events',
  'mentions',
  'organizations',
  'feedback'
];

r.init(dbConfig,
  tables
).then(function(){
  console.log("DONE")
  process.exit();
})
