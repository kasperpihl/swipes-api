import r from 'rethinkdb';
import Promise from 'bluebird';
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

const pageItems = 500;
let item = 0;
let offset = 500;
const promises = [];

console.log('Picking information!');

const pagination = (resolve, reject) => {
  const tokens = r.table('milestones').orderBy('created_at').slice(item, offset);

  db.rethinkQuery(tokens, { dbConfig })
    .then((results) => {
      if (results.length > 0) {
        item += pageItems;
        offset += pageItems;

        const rows = results.map((row) => {
          return {
            id: row.id,
            name: row.title,
            closed_at: row.closed_at,
            created_at: row.created_at,
            updated_at: row.updated_at,
            created_by: row.created_by,
            goal_order: row.goal_order,
            organization_id: row.organization_id,
          };
        });

        promises.push(pg.batchInsert('plans', rows));

        return pagination(resolve, reject);
      }

      return resolve();
    })
    .catch((error) => {
      return reject(error);
    });
};

console.log('Running queries');

const wrapperPromise = () => new Promise((resolve, reject) => {
  pagination(resolve, reject);
});

wrapperPromise()
  .then(() => {
    return Promise.all(promises);
  })
  .then(() => {
    console.log('Done!');
    process.exit();
  })
  .catch((error) => {
    console.log(error);
    process.exit();
  });
