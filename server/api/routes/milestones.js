import express from 'express';
import {
  string,
  object,
} from 'valjs';
import {
  milestonesCreate,
  milestonesInsert,
  milestonesClose,
  milestonesCreateQueueMessage,
  milestonesCloseQueueMessage,
} from './middlewares/milestones';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  valBody,
  valResponseAndSend,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/milestones.create',
  valBody({
    title: string.require(),
    organization_id: string.require(),
    due_date: string.format('iso8601'),
  }),
  milestonesCreate,
  milestonesInsert,
  milestonesCreateQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    milestone: object.require(),
  }));

authed.all('/milestones.close',
  valBody({
    id: string.require(),
  }),
  milestonesClose,
  milestonesCloseQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    id: string.require(),
  }));

export {
  authed,
  notAuthed,
};
