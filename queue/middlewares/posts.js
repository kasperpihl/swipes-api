import {
  dbPostsGetSingle,
  dbPostsGetSingleCommentAndFollowers,
} from '../db_utils/posts';
import {
  objectToArray,
} from '../utils';

const uniqueCommentUserIds = (comments) => {
  const userIds = [];
  const commentsArray = objectToArray(comments);

  commentsArray.sort((a, b) => {
    return b.created_at - a.created_at;
  }).forEach((comment) => {
    userIds.push(comment.created_by);
  });

  return Array.from(new Set(userIds));
};
const postsGetSingle = (req, res, next) => {
  const {
    post_id,
  } = res.locals;

  return dbPostsGetSingle({ post_id })
    .then((post) => {
      res.locals.post = post;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};
const postsGetSingleCommentAndFollowers = (req, res, next) => {
  const {
    post_id,
    comment_id,
  } = res.locals;

  return dbPostsGetSingleCommentAndFollowers({ post_id, comment_id })
    .then((postSingleCommentAndFollowers) => {
      res.locals.postSingleCommentAndFollowers = postSingleCommentAndFollowers;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};
const postCreatedNotificationData = (req, res, next) => {
  const {
    user_id,
    post,
  } = res.locals;

  res.locals.notificationData = {
    target: {
      id: post.id,
    },
    meta: {
      created_by: user_id,
      type: post.type,
      message: post.message,
      context: post.context,
    },
  };
  res.locals.eventData = {
    post,
  };

  return next();
};
const postCommentAddedNotificationData = (req, res, next) => {
  const {
    post,
    comment_id,
  } = res.locals;

  res.locals.notificationData = {
    target: {
      id: post.id,
    },
    meta: {
      user_ids: uniqueCommentUserIds(post.comments),
      message: post.message,
      context: post.context,
      type: post.type,
    },
  };
  res.locals.eventData = {
    post_id: post.id,
    comment: post.comments[comment_id],
  };

  return next();
};
const postReactionAddedNotificationData = (req, res, next) => {
  const {
    user_id,
    post,
    reaction,
  } = res.locals;

  res.locals.notificationData = {
    target: {
      id: post.id,
    },
    meta: {
      last_reaction: reaction,
      user_ids: post.reactions.map(r => r.created_by),
      message: post.message,
      context: post.context,
      type: post.type,
    },
  };
  res.locals.eventData = {
    post_id: post.id,
    reaction: post.reactions.find(r => r.created_by === user_id),
  };

  return next();
};
const postReactionRemovedNotificationData = (req, res, next) => {
  const {
    user_id,
    post_id,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    user_id,
    post_id,
  };

  return next();
};
const postCommentReactionAddedNotificationData = (req, res, next) => {
  const {
    user_id,
    post_id,
    comment_id,
    postSingleCommentAndFollowers,
    reaction,
  } = res.locals;
  const comment = postSingleCommentAndFollowers.comment;

  res.locals.notificationData = {
    target: {
      comment_id,
      id: post_id,
    },
    meta: {
      last_reaction: reaction,
      user_ids: comment.reactions.map(r => r.created_by),
      message: comment.message,
    },
  };
  res.locals.eventData = {
    post_id,
    comment_id,
    reaction: comment.reactions.find(r => r.created_by === user_id),
  };

  return next();
};
const postCommentReactionRemovedNotificationData = (req, res, next) => {
  const {
    user_id,
    post_id,
    comment_id,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    user_id,
    post_id,
    comment_id,
  };

  return next();
};

export {
  postsGetSingle,
  postsGetSingleCommentAndFollowers,
  postCreatedNotificationData,
  postCommentAddedNotificationData,
  postReactionAddedNotificationData,
  postReactionRemovedNotificationData,
  postCommentReactionAddedNotificationData,
  postCommentReactionRemovedNotificationData,
};
