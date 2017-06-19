import express from 'express';
import {
  string,
  object,
} from 'valjs';
import {
  waysCreate,
  waysInsert,
  waysArchive,
  waysCreateQueueMessage,
  waysArchiveQueueMessage,
  waysCopyAttachments,
  waysCopySteps,
} from './middlewares/ways';
import {
  notesGetMultipleFromGoal,
} from './middlewares/notes';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  valBody,
  valResponseAndSend,
} from '../utils';
import {
  goalMoreStrict,
} from '../validators';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/ways.create',
  valBody({
    title: string.require(),
    organization_id: string.require(),
    description: string,
    goal: goalMoreStrict,
  }),
  notesGetMultipleFromGoal,
  waysCopyAttachments,
  waysCopySteps,
  waysCreate,
  waysInsert,
  waysCreateQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    way: object.require(),
  }));

authed.all('/ways.archive',
  valBody({
    id: string.require(),
  }),
  waysArchive,
  waysArchiveQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    id: string.require(),
  }));

export {
  authed,
  notAuthed,
};
