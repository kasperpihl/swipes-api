import r from 'rethinkdb';
import Promise from 'bluebird';
import BlueBirdQueue from 'bluebird-queue';
import dbRunQuery from '../../src/utils/db/dbRunQuery';

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


const queue = new BlueBirdQueue({
  concurrency: 1,
});
const pageItems = 1000;
let item = 0;
let offset = 1000;
let promises = [];

console.log('Picking information!');

const totals = {
  comments: 0,
};

const pagination = (resolve, reject) => {
  // const commentsQ = r.table('comments').filter({ organization_id: 'ONY8E94FL' }).orderBy('created_at').slice(item, offset);
  const commentsQ = r.table('comments').orderBy('sent_at').slice(item, offset);

  dbRunQuery(commentsQ, { dbConfig })
    .then((results) => {
      if (results.length > 0) {
        item += pageItems;
        offset += pageItems;

        const comments = results.map((row) => {
          const reactions = row.reactions;
          const newReactions = {};

          totals.comments += 1;

          Object.keys(reactions).forEach((k) => {
            if (k.startsWith('U')) {
              newReactions[k] = reactions[k];
            } else {
              const innerObj = reactions[k];

              Object.keys(innerObj).forEach((j) => {
                newReactions[j] = innerObj[j];
              });
            }
          });

          row.reactions = newReactions;

          const commentUpdateQ = r.table('comments').get(row.id).update({ reactions: r.literal(newReactions) });

          promises.push(dbRunQuery(commentUpdateQ), { dbConfig });

          // queue.add(dbRunQuery(commentUpdateQ, { dbConfig }));

          return row;
        });


        return Promise.all(promises).then(() => {
          promises = [];
          setTimeout(() => {
            return pagination(resolve, reject);
          }, 2000);
        });
      }

      console.log(totals);

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
    console.log('Waiting for queries to execute');
    // return queue.start();
  })
  .then(() => {
    console.log('Done!');
    process.exit();
  })
  .catch((error) => {
    console.log(error);
    process.exit();
  });
