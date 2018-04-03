import r from 'rethinkdb';
// import Promise from 'bluebird';
// import * as Knex from 'knex';
import db from '../../db';

const pg = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    database: 'swipes_workspace',
    password: 'root',
    port: 5432,
  },
});

const dbConfig = {
  host: 'rethinkdb-staging6110.cloudapp.net',
  port: 28015,
  db: 'swipes',
  user: 'swipes',
  password: 'sw1py@staging',
};

if (!dbConfig) {
  console.log('Don\'t you need the live config here?!?!');

  process.exit();
}

const users = r.table('users');

console.log('Picking information!');

db.rethinkQuery(users, { dbConfig })
  .then((results) => {
    console.log('Preparing queries!');

    const rows = results.map((row) => {
      return {
        id: row.id,
        email: row.email,
        profile: row.profile,
        password: row.password,
        activated: row.activated,
        settings: row.settings,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    });

    return pg.batchInsert('users', rows);
  })
  .then(() => {
    console.log('Done!');
    process.exit();
  })
  .catch((error) => {
    console.log(error);
    process.exit();
  });
