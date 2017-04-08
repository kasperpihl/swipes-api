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
} from './middlewares/me';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';

const authed = express.Router();
const notAuthed = express.Router();

notAuthed.all('/me.updateSettings',
  valBody({
    settings: object.require(),
  }),
  meUpdateSettings,
  meUpdateSettingsQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    settings: object.require(),
  }));

export {
  notAuthed,
  authed,
};
