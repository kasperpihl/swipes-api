import express from 'express';
import {
  string,
  object,
} from 'valjs';
import {
  milestonesCreate,
  milestonesInsert,
  milestonesArchive,
  milestonesCreateQueueMessage,
  milestonesArchiveQueueMessage,
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
    description: string,
    due_date: string.format('iso8601'),
  }),
  milestonesCreate,
  milestonesInsert,
  milestonesCreateQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    milestone: object.as({
      id: string.require(),
      title: string.require(),
    }).require(),
  }));

authed.all('/milestones.archive',
  valBody({
    id: string.require(),
  }),
  milestonesArchive,
  milestonesArchiveQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    id: string.require(),
  }));

export {
  authed,
  notAuthed,
};
