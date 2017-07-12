import {
  string,
  object,
  array,
} from 'valjs';
import {
  dbPostsInsertSingle,
  dbPostsAddComment,
  dbPostsAddReaction,
} from './db_utils/posts';
import {
  generateSlackLikeId,
  valLocals,
} from '../../utils';

const postsCreate = valLocals('postsCreate', {
  user_id: string.require(),
  organization_id: string.require(),
  message: string.min(1).require(),
  type: string.require(),
  attachments: array.of(object),
  tagged_users: array.of(string),
  context: object,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization_id,
    message,
    type,
    attachments = [],
    tagged_users = [],
    context = {},
  } = res.locals;

  const post = {
    organization_id,
    message,
    type,
    attachments,
    tagged_users,
    context,
    id: generateSlackLikeId('P'),
    created_at: new Date(),
    updated_at: new Date(),
    created_by: user_id,
    archived: false,
    followers: [...new Set([...[user_id], ...tagged_users])],
    comments: {},
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
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post,
  } = res.locals;
  const event_type = 'post_created';
  const queueMessage = {
    user_id,
    event_type,
    notification_id_sufix: `${post.id}-${event_type}`,
    post_id: post.id,
  };

  setLocals({
    queueMessage,
    messageGroupId: post.id,
  });

  return next();
});

const postsCreateComment = valLocals('postsCreateComment', {
  user_id: string.require(),
  message: string.require(),
  attachments: array.of(object),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    message,
    attachments = [],
  } = res.locals;

  const comment = {
    message,
    attachments,
    id: generateSlackLikeId('C'),
    created_at: new Date(),
    updated_at: new Date(),
    created_by: user_id,
    archived: false,
    reactions: [],
  };

  setLocals({
    comment,
  });

  return next();
});

const postsAddComment = valLocals('postsAddComment', {
  user_id: string.require(),
  post_id: string.require(),
  comment: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
    comment,
  } = res.locals;

  dbPostsAddComment({ user_id, post_id, comment })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const postsAddCommentQueueMessage = valLocals('postsAddCommentQueueMessage', {
  user_id: string.require(),
  post_id: string.require(),
  comment: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
    comment,
  } = res.locals;
  const event_type = 'post_comment_added';
  const queueMessage = {
    user_id,
    post_id,
    event_type,
    notification_id_sufix: `${post_id}-${comment.id}-${event_type}`,
    comment_id: comment.id,
  };

  setLocals({
    queueMessage,
    messageGroupId: post_id,
  });

  return next();
});
const postsCreateReaction = valLocals('postsCreateReaction', {
  user_id: string.require(),
  reaction: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    reaction,
  } = res.locals;

  const reactionObj = {
    reaction,
    created_by: user_id,
  };

  setLocals({
    reaction: reactionObj,
  });

  return next();
});
const postsAddReaction = valLocals('postsAddReaction', {
  user_id: string.require(),
  post_id: string.require(),
  reaction: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
    reaction,
  } = res.locals;

  dbPostsAddReaction({ user_id, post_id, reaction })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const postsAddReactionQueueMessage = valLocals('postsAddReactionQueueMessage', {
  user_id: string.require(),
  post_id: string.require(),
  reaction: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
    reaction,
  } = res.locals;
  const event_type = 'post_reaction_added';
  const queueMessage = {
    user_id,
    post_id,
    reaction,
    event_type,
    notification_id_sufix: `${post_id}-${event_type}`,
  };

  setLocals({
    queueMessage,
    messageGroupId: post_id,
  });

  return next();
});

export {
  postsCreate,
  postsInsertSingle,
  postsCreatedQueueMessage,
  postsCreateComment,
  postsAddComment,
  postsAddCommentQueueMessage,
  postsCreateReaction,
  postsAddReaction,
  postsAddReactionQueueMessage,
};
