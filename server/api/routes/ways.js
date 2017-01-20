import express from 'express';
import {
  string,
  object,
} from 'valjs';
import {
  waysCreate,
  waysInsert,
  waysDelete,
  waysCreateQueueMessage,
  waysDeleteQueueMessage,
} from './middlewares/ways';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  valBody,
  valResponseAndSend,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/ways.create',
  valBody({
    title: string.require(),
    organization_id: string.require(),
    description: string,
    goal: object.require(),
  }),
  waysCreate,
  waysInsert,
  waysCreateQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    way: object.require(),
  }));

authed.all('/ways.delete',
  valBody({
    id: string.require(),
  }),
  waysDelete,
  waysDeleteQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    id: string.require(),
  }));

export {
  authed,
  notAuthed,
};
