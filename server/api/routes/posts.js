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
  postsMentionsParseComment,
  postsAddCommentQueueMessage,
  postsCreateReaction,
  postsAddReaction,
  postsAddReactionQueueMessage,
  postsRemoveReaction,
  postsRemoveReactionQueueMessage,
  postsCommentAddReaction,
  postsCommentAddReactionQueueMessage,
  postsCommentRemoveReaction,
  postsCommentRemoveReactionQueueMessage,
  postsArchiveSingle,
  postsArchiveQueueMessage,
  postsUnfollow,
  postsUnfollowQueueMessage,
  postsFollow,
  postsFollowQueueMessage,
  postsMestionsQueueMessage,
  postsCreatedPushNotificationQueueMessage,
  postsAddCommentPushNotificationQueueMessage,
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
  postsCreatedPushNotificationQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    post: object.require(),
  }),
);

authed.all('/posts.follow',
  valBody({
    post_id: string.require(),
  }),
  postsFollow,
  postsFollowQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    user_id: string.require(),
    post_id: string.require(),
  }),
);

authed.all('/posts.unfollow',
  valBody({
    post_id: string.require(),
  }),
  postsUnfollow,
  postsUnfollowQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    user_id: string.require(),
    post_id: string.require(),
  }),
);

authed.all('/posts.archive',
  valBody({
    post_id: string.require(),
  }),
  postsArchiveSingle,
  postsArchiveQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    post_id: string.require(),
  }),
);

authed.all('/posts.addComment',
  valBody({
    post_id: string.require(),
    message: string.min(1).require(),
    attachments: array.of(object),
  }),
  postsCreateComment,
  postsAddComment,
  postsMentionsParseComment,
  postsAddCommentQueueMessage,
  notificationsPushToQueue,
  postsMestionsQueueMessage,
  notificationsPushToQueue,
  postsAddCommentPushNotificationQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    post_id: string.require(),
    comment: object.require(),
  }),
);

authed.all('/posts.addReaction',
  valBody({
    post_id: string.require(),
    reaction: string.require(),
  }),
  postsCreateReaction,
  postsAddReaction,
  postsAddReactionQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    post_id: string.require(),
    reaction: object.require(),
  }),
);

authed.all('/posts.removeReaction',
  valBody({
    post_id: string.require(),
  }),
  postsRemoveReaction,
  postsRemoveReactionQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    user_id: string.require(),
    post_id: string.require(),
  }),
);

authed.all('/posts.commentAddReaction',
valBody({
  post_id: string.require(),
  comment_id: string.require(),
  reaction: string.require(),
}),
postsCreateReaction,
postsCommentAddReaction,
postsCommentAddReactionQueueMessage,
notificationsPushToQueue,
valResponseAndSend({
  post_id: string.require(),
  comment_id: string.require(),
  reaction: object.require(),
}),
);

authed.all('/posts.commentRemoveReaction',
  valBody({
    post_id: string.require(),
    comment_id: string.require(),
  }),
  postsCommentRemoveReaction,
  postsCommentRemoveReactionQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    user_id: string.require(),
    post_id: string.require(),
    comment_id: string.require(),
  }),
);

export {
  authed,
  notAuthed,
};
