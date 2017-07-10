import express from 'express';
import {
  string,
  object,
  array,
} from 'valjs';
import {
  postsCreate,
  postsInsertSingle,
  postsCreatedQueueMessage,
} from './middlewares/posts';
import {
} from './middlewares/users';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  notificationCreateGroupId,
} from './middlewares/util_middlewares';
import {
  valBody,
  valResponseAndSend,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/posts.create',
  valBody({
    organization_id: string.require(),
    message: string.require(),
    type: string.require(),
    attachments: array.of(object),
    tagged_users: array.of(string),
    context: object.as({
      id: string.require(),
      title: string.require(),
    }),
  }),
  notificationCreateGroupId,
  postsCreate,
  postsInsertSingle,
  postsCreatedQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    post: object.require(),
  }),
);

export {
  authed,
  notAuthed,
};
