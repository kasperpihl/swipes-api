import aws from 'aws-sdk';
import config from 'config';
import mime from 'mime-types';
import {
  string,
} from 'valjs';
import {
  dbFilesAdd,
} from './db_utils/files';
import {
  SwipesError,
} from '../../../middlewares/swipes-error';
import {
  valLocals,
  generateSlackLikeId,
} from '../../utils';

const awsConfig = config.get('awsS3');

aws.config.update({
  accessKeyId: awsConfig.accessKey,
  secretAccessKey: awsConfig.secretKey,
});

const filesCreateS3Path = valLocals('filesCreateS3Name', {
  user_id: string.require(),
  organization_id: string.require(),
  file_name: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization_id,
    file_name,
  } = res.locals;
  const seconds = Date.now() / 1000 | 0;
  const s3Path = `uploads/${organization_id}/${seconds}-${user_id}/${file_name}`;

  setLocals({
    s3Path,
  });

  return next();
});
const filesGetSignedUrl = valLocals('filesGetSignedUrl', {
  s3Path: string.require(),
  file_type: string.require(),
}, (req, res, next, setLocals) => {
  const {
    s3Path,
    file_type,
  } = res.locals;
  const s3 = new aws.S3({
    region: 'us-west-2',
  });
  const params = {
    Bucket: awsConfig.bucketName,
    Key: s3Path,
    Expires: 60,
    ContentType: file_type,
  };

  s3.getSignedUrl('putObject', params, (err, data) => {
    if (err) {
      return next(new SwipesError('Trying to get signed url', err));
    }

    setLocals({
      s3_url: `${awsConfig.url}${s3Path}`,
      signed_url: data,
    });

    return next();
  });
});
const filesAddToFilesTable = valLocals('filesAddToFilesTable', {
  user_id: string.require(),
  organization_id: string.require(),
  file_name: string.require(),
  s3_url: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization_id,
    file_name,
    s3_url,
  } = res.locals;
  const fileId = generateSlackLikeId('F', 10);
  const nameArr = file_name.split('.');
  const ext = nameArr[nameArr.length - 1];
  const contentType = mime.lookup(ext) || 'application/octet-stream';

  dbFilesAdd({ user_id, organization_id, file_name, s3_url, fileId, contentType })
    .then((results) => {
      const changes = results.changes[0];

      setLocals({
        file_id: changes.new_val.id,
        link: {
          service: {
            id: fileId,
            name: 'swipes',
            type: 'file',
          },
          permission: {
            account_id: user_id,
          },
          meta: {
            title: file_name,
          },
        },
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});

export {
  filesCreateS3Path,
  filesGetSignedUrl,
  filesAddToFilesTable,
};
