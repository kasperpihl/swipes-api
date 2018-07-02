import r from 'rethinkdb';
import dbRunQuery from 'src/utils/db/dbRunQuery';

// const dbConfig = null;
// const dbConfig = {
//   host: 'rethinkdb-live5931.cloudapp.net',
//   port: 28015,
//   db: 'swipes',
//   user: 'swipes-live',
//   password: '',
// };

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

const user_id = 'USTFL9YVE';
const usersQ = r.table('users').get(user_id);

console.log('Picking information!');

dbRunQuery(usersQ, { dbConfig })
  .then((results) => {
    const {
      profile,
      email,
    } = results;
    const {
      first_name,
      last_name,
      photos,
    } = profile;
    const personal_info = {
      email,
      name: `${first_name} ${last_name}`,
      photos,
    };

    console.log(personal_info);
  })
  .then(() => {
    console.log('Done!');

    process.exit();
  });
