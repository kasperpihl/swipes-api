import express from 'express';
import {
  object,
  string,
} from 'valjs';
import {
  valBody,
  valResponseAndSend,
  mapLocals,
} from '../utils';
import {
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
} from './middlewares/me';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  authParseToken,
  authCheckToken,
} from '../../middlewares/jwt-auth-middleware';

const authed = express.Router();
const notAuthed = express.Router();
const multipart = express.Router();

authed.all('/me.updateSettings',
  valBody({
    settings: object.require(),
  }),
  meUpdateSettings,
  meUpdateSettingsQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    settings: object.require(),
  }));

authed.all('/me.updateProfile',
  valBody({
    profile: object.require(),
  }),
  meUpdateProfile,
  meUpdateProfileQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    user_id: string.require(),
    profile: object.require(),
  }));

multipart.post('/me.uploadProfilePhoto',
  meUploadProfilePhoto,
  authParseToken,
  authCheckToken,
  meProfilePhotoResize,
  meUploadProfilePhotoToS3,
  meUpdateProfile,
  meUpdateProfileQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    user_id: string.require(),
    profile: object.require(),
  }),
);

notAuthed.post('/me.sendResetEmail',
  valBody({
    email: string.format('email').require(),
  }),
  mapLocals(
    ['email'],
    (setLocals, email) => {
      setLocals({
        email: email.toLowerCase(),
      });
    },
  ),
  meAccountExists,
  meCreateResetToken,
  meResetEmailQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend(),
);

notAuthed.post('/me.verifyResetToken',
  valBody({
    token: string.require(),
  }),
  meVerifyResetToken,
  valResponseAndSend(),
);

notAuthed.post('/me.resetPassword',
  valBody({
    token: string.require(),
    password: string.min(1).require(),
  }),
  meVerifyResetToken,
  meResetPassword,
  valResponseAndSend(),
);

export {
  notAuthed,
  authed,
  multipart,
};
