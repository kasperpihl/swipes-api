import aws from 'aws-sdk';
import config from 'config';
import {
  string,
} from 'valjs';
import {
  SwipesError,
} from '../../../middlewares/swipes-error';
import {
  valLocals,
} from '../../utils';

const awsConfig = config.get('awsS3');

aws.config.update({
  accessKeyId: awsConfig.accessKey,
  secretAccessKey: awsConfig.secretKey,
});

const filesGetSignedUrl = valLocals('filesGetSignedUrl', {
  file_name: string.require(),
  file_type: string.require(),
}, (req, res, next, setLocals) => {
  const {
    file_name,
    file_type,
  } = res.locals;
  const s3 = new aws.S3({
    region: 'us-west-2',
  });
  const params = {
    Bucket: awsConfig.bucketName,
    Key: file_name,
    Expires: 60,
    ContentType: file_type,
  };

  s3.getSignedUrl('putObject', params, (err, data) => {
    if (err) {
      return next(new SwipesError('Trying to get signed url', err));
    }

    setLocals({
      signed_url: data,
    });

    return next();
  });
});

export {
  filesGetSignedUrl,
};
