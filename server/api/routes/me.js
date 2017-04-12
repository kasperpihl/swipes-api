import express from 'express';
import {
  object,
} from 'valjs';
import {
  valBody,
  valResponseAndSend,
} from '../utils';
import {
  meUpdateSettings,
  meUpdateSettingsQueueMessage,
  meUpdateProfile,
  meUpdateProfileQueueMessage,
} from './middlewares/me';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';

const authed = express.Router();
const notAuthed = express.Router();

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
    profile: object.require(),
  }));

export {
  notAuthed,
  authed,
};
