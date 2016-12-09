import express from 'express';
import {
  validateNotificationsMarkAsSeen,
} from '../validators/notifications';
import {
  notificationsMarkAsSeen,
} from './middlewares/notifications';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/notifications.markAsSeen',
  validateNotificationsMarkAsSeen,
  notificationsMarkAsSeen,
  (req, res, next) => {
    return res.status(200).json({ ok: true });
  });

export {
  notAuthed,
  authed,
};
