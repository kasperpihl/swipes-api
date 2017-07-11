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
  postsCreateComment,
  postsAddComment,
  postsAddCommentQueueMessage,
} from './middlewares/posts';
import {
} from './middlewares/users';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  valBody,
  valResponseAndSend,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/posts.create',
  valBody({
    organization_id: string.require(),
    message: string.min(1).require(),
    type: string.require(),
    attachments: array.of(object),
    tagged_users: array.of(string),
    context: object.as({
      id: string.require(),
      title: string.require(),
    }),
  }),
  postsCreate,
  postsInsertSingle,
  postsCreatedQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    post: object.require(),
  }),
);

authed.all('/posts.addComment',
  valBody({
    post_id: string.require(),
    message: string.require(),
    attachments: array.of(object),
    reactions: array.of(object),
  }),
  postsCreateComment,
  postsAddComment,
  // postsAddCommentQueueMessage,
  // notificationsPushToQueue,
  valResponseAndSend({
    post_id: string.require(),
    comment: object.require(),
  }),
);

export {
  authed,
  notAuthed,
};
