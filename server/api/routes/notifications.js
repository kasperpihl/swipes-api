import express from 'express';
import {
  string,
  array,
} from 'valjs';
import {
  notificationsMarkAsSeenIds,
  notificationsMarkAsSeenIdsQueueMessage,
  notificationsMarkAsSeenIdsHistoryUpdatedEventType,
  notificationsPushToQueue,
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
  notificationsMarkAsSeenIds,
  notificationsMarkAsSeenIdsQueueMessage,
  notificationsPushToQueue,
  notificationsMarkAsSeenIdsHistoryUpdatedEventType,
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
