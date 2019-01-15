import AWS from 'aws-sdk';
import config from 'config';

const { secretAccessKey, accessKeyId } = config.get('aws');

AWS.config.update({
  accessKeyId,
  secretAccessKey
});
