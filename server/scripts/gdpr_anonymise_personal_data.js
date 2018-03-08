import r from 'rethinkdb';
import aws from 'aws-sdk';
import config from 'config';
import db from '../db';

// const dbConfig = null;
// const dbConfig = {
//   host: 'rethinkdb-live5931.cloudapp.net',
//   port: 28015,
//   db: 'swipes',
//   user: 'swipes-live',
//   password: '',
// };

const awsConfig = config.get('awsS3');
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

aws.config.update({
  accessKeyId: awsConfig.accessKey,
  secretAccessKey: awsConfig.secretKey,
});

const s3 = new aws.S3({
  region: awsConfig.region,
});

const extractKeyFromUrl = (url) => {
  return url.split(`${awsConfig.bucketName}/`)[1];
};

const user_id = 'USTFL9YVE';
const new_email_name = `anonymous_${user_id}`;
const usersQ = r.table('users').get(user_id);
const usersUpdateQ = r.table('users').get(user_id).update({
  email: new_email_name,
  profile: {
    bio: '',
    role: '',
    first_name: new_email_name,
    last_name: '',
    photos: null,
  },
});

db.rethinkQuery(usersQ, { dbConfig })
  .then((results) => {
    const {
      profile,
    } = results;
    const {
      photos,
    } = profile;
    const s3PromiseArray = [];

    Object.entries(photos).forEach(([key, value]) => {
      s3PromiseArray.push(s3.deleteObject({
        Bucket: awsConfig.bucketName,
        Key: extractKeyFromUrl(value),
      }).promise());
    });

    console.log('Removing pictures');
    return Promise.all(s3PromiseArray);
  })
  .then(() => {
    return db.rethinkQuery(usersUpdateQ, { dbConfig });
  })
  .then(() => {
    console.log('Done!');

    process.exit();
  })
  .catch((err) => {
    console.log(err);

    process.exit();
  });
