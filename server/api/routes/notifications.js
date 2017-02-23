import express from 'express';
import {
  string,
  array,
} from 'valjs';
import {
  notificationsMarkAsSeenTs,
  notificationsMarkAsSeenIds,
  notificationsMarkAsSeenTsQueueMessage,
  notificationsMarkAsSeenIdsQueueMessage,
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  valBody,
  valResponseAndSend,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/notifications.markAsSeen.ts',
  valBody({
    timestamp: string.format('iso8601').require(),
  }),
  notificationsMarkAsSeenTs,
  notificationsMarkAsSeenTsQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    marked_at: string.require(),
    last_marked: string.require(),
  }));

authed.all('/notifications.markAsSeen.ids',
  valBody({
    notification_ids: array.of(string).require(),
  }),
  notificationsMarkAsSeenIds,
  notificationsMarkAsSeenIdsQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    notification_ids: array.of(string).require(),
    last_marked: string.require(),
  }),
);

export {
  notAuthed,
  authed,
};
