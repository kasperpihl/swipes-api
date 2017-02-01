import express from 'express';
import {
  string,
} from 'valjs';
import {
  notificationsMarkAsSeen,
} from './middlewares/notifications';
import {
  valBody,
  valResponseAndSend,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/notifications.markAsSeen',
  valBody({
    timestamp: string.format('iso8601').require(),
  }),
  notificationsMarkAsSeen,
  valResponseAndSend({
    marked_at: string.require(),
    last_marked: string.require(),
  }));

export {
  notAuthed,
  authed,
};
