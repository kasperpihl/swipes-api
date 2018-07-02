import sha1 from 'sha1';
import {
  string,
  object,
  array,
} from 'valjs';
import config from 'config';
import multer from 'multer';
import sharp from 'sharp';
import Promise from 'bluebird';
import AWS from 'aws-sdk';
import fs from 'fs';
import mime from 'mime-types';
import {
  dbMeUpdateSettings,
  dbMeUpdateProfile,
} from './db_utils/me';
import {
  dbUsersGetByEmail,
  dbUsersResetPassword,
} from './db_utils/users';
import {
  valLocals,
  createTokens,
  parseToken,
} from '../../utils';
import SwipesError from 'src/utils/SwipesError';

const s3Config = config.get('awsS3');

AWS.config.update({
  accessKeyId: s3Config.accessKey,
  secretAccessKey: s3Config.secretKey,
});
AWS.config.setPromisesDependency(Promise);

const upload = multer({ dest: '/tmp/' }).single('photo');
const resizePhoto = ({ size, path }) => {
  return sharp(path)
    .crop(sharp.gravity.center)
    .resize(size, size, {
      interpolator: sharp.interpolator.nohalo,
    })
    .toBuffer();
};
const meUpdateSettings = valLocals('meUpdateSettings', {
  user_id: string.require(),
  settings: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    settings,
  } = res.locals;

  dbMeUpdateSettings({ user_id, settings })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const meUpdateSettingsQueueMessage = valLocals('meUpdateSettingsQueueMessage', {
  user_id: string.require(),
  settings: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    settings,
  } = res.locals;
  const queueMessage = {
    user_id,
    settings,
    event_type: 'settings_updated',
  };

  setLocals({
    queueMessage,
    messageGroupId: user_id,
  });

  return next();
});
const meUpdateProfile = valLocals('meUpdateProfile', {
  user_id: string.require(),
  profile: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    profile,
  } = res.locals;

  dbMeUpdateProfile({ user_id, profile })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const meUpdateProfileQueueMessage = valLocals('meUpdateProfileQueueMessage', {
  user_id: string.require(),
  profile: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    profile,
  } = res.locals;
  const queueMessage = {
    user_id,
    profile,
    event_type: 'profile_updated',
  };

  setLocals({
    queueMessage,
    messageGroupId: user_id,
  });

  return next();
});
const meUploadProfilePhoto = valLocals('meUploadProfilePhoto', {
}, (req, res, next, setLocals) => {
  upload(req, res, (err) => {
    if (err) {
      return next(new SwipesError('Something went wrong with the upload', { err }));
    }

    setLocals({
      token: req.body.token,
      file: req.file,
    });

    return next();
  });
});
const meProfilePhotoResize = valLocals('meProfilePhotoResize', {
  file: object.require(),
}, (req, res, next, setLocals) => {
  const {
    file,
  } = res.locals;
  const resizePromises = [
    resizePhoto({ size: 192, path: file.path }),
    resizePhoto({ size: 96, path: file.path }),
    resizePhoto({ size: 64, path: file.path }),
  ];

  Promise.all(resizePromises)
    .then((resizedImages) => {
      setLocals({
        resizedImages,
      });

      return next();
    })
    .catch((err) => {
      return next(new SwipesError('Something went wrong with the resizing', { err }));
    });
});
const meUploadProfilePhotoToS3 = valLocals('meUploadProfilePhotoToS3', {
  user_id: string.require(),
  file: object.require(),
  resizedImages: array.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    file,
    resizedImages,
  } = res.locals;
  const s3 = new AWS.S3({
    region: 'us-west-2',
  });
  const seconds = Date.now() / 1000 | 0;
  const s3Path = `profile_photos/${seconds}-${user_id}/`;
  const originalFileStream = fs.createReadStream(file.path);
  const mimetype = file.mimetype;
  const fileExt = mime.extension(mimetype);
  const paths = {
    original: `${s3Path}original.${fileExt}`,
    '192x192': `${s3Path}192x192.${fileExt}`,
    '96x96': `${s3Path}96x96.${fileExt}`,
    '64x64': `${s3Path}64x64.${fileExt}`,
  };

  const uploadPromises = [
    s3.putObject({
      Bucket: s3Config.bucketName,
      ContentType: mimetype,
      Key: `${s3Path}original.${fileExt}`,
      Body: originalFileStream,
    }).promise(),
    s3.putObject({
      Bucket: s3Config.bucketName,
      ContentType: mimetype,
      Key: `${s3Path}192x192.${fileExt}`,
      Body: resizedImages[0],
    }).promise(),
    s3.putObject({
      Bucket: s3Config.bucketName,
      ContentType: mimetype,
      Key: `${s3Path}96x96.${fileExt}`,
      Body: resizedImages[1],
    }).promise(),
    s3.putObject({
      Bucket: s3Config.bucketName,
      ContentType: mimetype,
      Key: `${s3Path}64x64.${fileExt}`,
      Body: resizedImages[2],
    }).promise(),
  ];

  Promise.all(uploadPromises)
    .then(() => {
      setLocals({
        profile: {
          photos: {
            original: `${s3Config.url}${paths.original}`,
            '192x192': `${s3Config.url}${paths['192x192']}`,
            '96x96': `${s3Config.url}${paths['96x96']}`,
            '64x64': `${s3Config.url}${paths['64x64']}`,
          },
        },
      });

      return next();
    })
    .catch((err) => {
      return next(new SwipesError('Something went wrong with the uploading to s3', { err }));
    });
});
const meAccountExists = valLocals('meAccountExists', {
  email: string.format('email').require(),
}, (req, res, next, setLocals) => {
  const {
    email,
  } = res.locals;

  return dbUsersGetByEmail({ email })
    .then((result) => {
      if (result.length > 0) {
        const user = result[0];

        setLocals({
          user,
        });
      }

      return next();
    })
    .catch((err) => {
      return next(new SwipesError('meAccountExists', { err }));
    });
});
const meCreateResetToken = valLocals('meCreateResetToken', {
  user: object,
}, (req, res, next, setLocals) => {
  const {
    user,
  } = res.locals;

  if (!user) {
    return next();
  }

  const tokens = createTokens({
    iss: user.id,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
  });

  setLocals({
    token: tokens.shortToken,
  });

  return next();
});
const meResetEmailQueueMessage = valLocals('meResetEmailQueueMessage', {
  email: string.format('email').require(),
  user: object,
}, (req, res, next, setLocals) => {
  const {
    email,
    user,
    token,
  } = res.locals;

  if (!user) {
    return next();
  }

  const queueMessage = {
    email,
    token,
    first_name: user.profile.first_name,
    event_type: 'send_reset_password_email',
  };

  setLocals({
    queueMessage,
    messageGroupId: user.id,
  });

  return next();
});
const meVerifyResetToken = valLocals('meVerifyResetToken', {
  token: string.require(),
}, (req, res, next, setLocals) => {
  const {
    token,
  } = res.locals;

  const parsedToken = parseToken(token);
  const tokenContent = parsedToken.content;
  const now = Math.floor(Date.now() / 1000);


  if (tokenContent.exp < now) {
    return next(new SwipesError('Invalid reset token'));
  }

  setLocals({
    tokenContent,
  });

  return next();
});
const meResetPassword = valLocals('meResetPassword', {
  tokenContent: object.require(),
  password: string.min(1).require(),
}, (req, res, next, setLocals) => {
  const {
    tokenContent,
    password,
  } = res.locals;

  const passwordSha1 = sha1(password);

  return dbUsersResetPassword({
    user_id: tokenContent.iss,
    password: passwordSha1,
  })
  .then(() => {
    return next();
  })
  .catch((err) => {
    return next(err);
  });
});

export {
  meUpdateSettings,
  meUpdateSettingsQueueMessage,
  meUpdateProfile,
  meUpdateProfileQueueMessage,
  meUploadProfilePhoto,
  meProfilePhotoResize,
  meUploadProfilePhotoToS3,
  meAccountExists,
  meCreateResetToken,
  meResetEmailQueueMessage,
  meVerifyResetToken,
  meResetPassword,
};
