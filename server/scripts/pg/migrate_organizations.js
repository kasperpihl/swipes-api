import r from 'rethinkdb';
import Promise from 'bluebird';
// import * as Knex from 'knex';
import db from '../../db';

// const dbConfig = null;
// const dbConfig = {
//   host: 'rethinkdb-live5931.cloudapp.net',
//   port: 28015,
//   db: 'swipes',
//   user: 'swipes-live',
//   password: '',
// };

// const client = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'swipes_workspace',
//   password: 'root',
//   port: 5432,
// });

// client.connect();

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

// const user_id = 'USTFL9YVE';
const organizations = r.table('organizations');

console.log('Picking information!');

const organizations_users_relationships = [];

db.rethinkQuery(organizations, { dbConfig })
  .then((results) => {
    console.log('Preparing queries!');

    const rows = results.filter((o) => {
      return o.trial.ending_at;
    }).map((row) => {
      if (row.admins) {
        row.admins.forEach((element) => {
          organizations_users_relationships.push({
            organization_id: row.id,
            user_id: element,
            admin: true,
            active: true,
            pending: false,
            disabled: false,
            owner: element === row.owner_id,
          });
        });
      }

      if (row.disabled_users) {
        row.disabled_users.forEach((element) => {
          organizations_users_relationships.push({
            organization_id: row.id,
            user_id: element,
            admin: false,
            active: false,
            pending: false,
            disabled: true,
            owner: false,
          });
        });
      }

      if (row.pending_users) {
        row.pending_users.forEach((element) => {
          organizations_users_relationships.push({
            organization_id: row.id,
            user_id: element,
            admin: false,
            active: false,
            pending: true,
            disabled: false,
            owner: false,
          });
        });
      }

      if (row.active_users) {
        row.active_users.forEach((element) => {
          if (!organizations_users_relationships.find(e => e.user_id === element)) {
            organizations_users_relationships.push({
              organization_id: row.id,
              user_id: element,
              admin: false,
              active: true,
              pending: false,
              disabled: false,
              owner: element === row.owner_id,
            });
          }
        });
      }

      return {
        id: row.id,
        name: row.name,
        created_at: row.created_at,
        updated_at: row.updated_at,
        plan: row.plan || null,
        stripe_customer_id: row.stripe_customer_id || null,
        stripe_subscription_id: row.stripe_subscription_id || null,
        invitation_code: row.invitation_code || null,
        trial_ending: row.trial.ending_at,
        trial_started: row.trial.started_at,
      };
    });

    return Promise.all([
      pg.batchInsert('organizations', rows),
      pg.batchInsert('organizations_users', organizations_users_relationships),
    ]);
  })
  .then(() => {
    console.log('Done!');

    process.exit();
  })
  .catch((error) => {
    console.log(error);
    process.exit();
  });
