import {
  string,
  object,
  array,
} from 'valjs';
import {
  dbPostsInsertSingle,
} from './db_utils/posts';
import {
  generateSlackLikeId,
  valLocals,
} from '../../utils';
import {
  SwipesError,
} from '../../../middlewares/swipes-error';

const postsCreate = valLocals('postsCreate', {
  user_id: string.require(),
  organization_id: string.require(),
  message: string.require(),
  type: string.require(),
  attachments: array.of(object),
  attachment_order: array.of(string),
  tagged_users: array.of(string),
  context: object,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization_id,
    message,
    type,
    attachments = {},
    attachment_order = [],
    tagged_users = [],
    context = {},
  } = res.locals;

  const post = {
    organization_id,
    message,
    type,
    attachments,
    attachment_order,
    tagged_users,
    context,
    id: generateSlackLikeId('P'),
    created_at: new Date(),
    updated_at: new Date(),
    created_by: user_id,
    archived: false,
    followers: [...new Set([...[user_id], ...tagged_users])],
    comments: [],
    reactions: [],
  };

  setLocals({
    post,
  });

  return next();
});

const postsInsertSingle = valLocals('postsInsertSingle', {
  post: object.require(),
}, (req, res, next, setLocals) => {
  const {
    post,
  } = res.locals;

  dbPostsInsertSingle({ post })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});

const postsCreatedQueueMessage = valLocals('postsCreatedQueueMessage', {
  user_id: string.require(),
  post: object.require(),
  notificationGroupId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post,
    notificationGroupId,
  } = res.locals;
  const queueMessage = {
    user_id,
    post_id: post.id,
    event_type: 'post_created',
    group_id: notificationGroupId,
  };

  setLocals({
    queueMessage,
    messageGroupId: post.id,
  });

  return next();
});

export {
  postsCreate,
  postsInsertSingle,
  postsCreatedQueueMessage,
};
