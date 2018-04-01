import r from 'rethinkdb';
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

db.rethinkQuery(organizations, { dbConfig })
  .then((results) => {
    // console.log(results);
    const rows = results.filter((o) => {
      return o.trial.ending_at;
    }).map((row) => {
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
        active_users: row.active_users || [],
        admins: row.admins || [],
        disabled_users: row.disabled_users || [],
        owner_id: row.owner_id,
        pending_users: row.pending_users || [],
      };
    });

    // console.log(rows);

    return pg.batchInsert('organizations', rows)
      .returning('id');

    // const sqlValues = [];

    // results.forEach((el) => {
    //   sqlValues.push(`(${el.id},
    //       ${el.name},
    //       ${el.created_at},
    //       ${el.updated_at},
    //       ${el.name_to_compare},
    //       ${el.plan},
    //       ${el.stripe_customer_id},
    //       ${el.stripe_subscription_id},
    //       ${el.invitation_code},
    //       ${el.trial.ending_at},
    //       ${el.trial.started_at},
    //       ${el.active_users},
    //       ${el.admins},
    //       ${el.disabled_users},
    //       ${el.owner_id},
    //       ${el.pending_users})`);
    // });
  })
  .then((ids) => {
    console.log(ids);
    console.log('Done!');

    process.exit();
  })
  .catch((error) => {
    console.log(error);
    process.exit();
  });
