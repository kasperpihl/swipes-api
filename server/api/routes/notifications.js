import express from 'express';
import {
  string,
  array,
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
    notification_ids: array.of(string).require(),
  }),
  notificationsMarkAsSeen,
  valResponseAndSend,
);

export {
  notAuthed,
  authed,
};
