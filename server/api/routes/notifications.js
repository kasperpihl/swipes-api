import express from 'express';
import {
  date,
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
    timestamp: date.require(),
  }),
  notificationsMarkAsSeen,
  valResponseAndSend(),
);

export {
  notAuthed,
  authed,
};
