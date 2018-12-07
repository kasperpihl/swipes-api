import r from 'rethinkdb';
import aws from 'aws-sdk';
import config from 'config';
import dbRunQuery from 'src/utils/db/dbRunQuery';

// const dbConfig = null;
// const dbConfig = {
//   host: 'rethinkdb-live5931.cloudapp.net',
//   port: 28015,
//   db: 'swipes',
//   user: 'swipes-live',
//   password: '',
// };

const { s3BucketName, s3Region, secretAccessKey, accessKeyId } = config.get(
  'aws'
);
const dbConfig = {
  host: 'rethinkdb-staging6110.cloudapp.net',
  port: 28015,
  db: 'swipes',
  user: 'swipes',
  password: 'sw1py@staging',
};

if (!dbConfig) {
  console.log("Don't you need the live config here?!?!");

  process.exit();
}

aws.config.update({
  accessKeyId,
  secretAccessKey,
});

const s3 = new aws.S3({
  region: s3Region,
});

const extractKeyFromUrl = url => {
  return url.split(`${s3BucketName}/`)[1];
};

const user_id = 'USTFL9YVE';
const new_email_name = `anonymous_${user_id}`;
const usersQ = r.table('users').get(user_id);
const usersUpdateQ = r
  .table('users')
  .get(user_id)
  .update({
    email: new_email_name,
    profile: {
      bio: '',
      role: '',
      first_name: new_email_name,
      last_name: '',
      photos: null,
    },
  });

dbRunQuery(usersQ, { dbConfig })
  .then(results => {
    const { profile } = results;
    const { photos } = profile;
    const s3PromiseArray = [];

    Object.entries(photos).forEach(([key, value]) => {
      s3PromiseArray.push(
        s3
          .deleteObject({
            Bucket: s3BucketName,
            Key: extractKeyFromUrl(value),
          })
          .promise()
      );
    });

    console.log('Removing pictures');
    return Promise.all(s3PromiseArray);
  })
  .then(() => {
    return dbRunQuery(usersUpdateQ, { dbConfig });
  })
  .then(() => {
    console.log('Done!');

    process.exit();
  })
  .catch(err => {
    console.log(err);

    process.exit();
  });
