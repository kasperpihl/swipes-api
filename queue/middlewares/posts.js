import {
  dbPostsGetSingle,
  dbPostsGetSingleCommentFollowers,
} from '../db_utils/posts';
import {
  objectToArray,
} from '../utils';

// const MAX_LENGHT = 50;
const cutTextRegExp = new RegExp(/^(.{50}[^\s]*).*/);
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
const getPrefixForType = (type) => {
  switch (type) {
    case 'information':
      return '';
    case 'announcement':
      return 'an ';
    case 'question':
    case 'post':
    default:
      return 'a ';
  }
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
const postsGetSingleCommentFollowers = (req, res, next) => {
  const {
    post_id,
    comment_id,
  } = res.locals;

  return dbPostsGetSingleCommentFollowers({ post_id, comment_id })
    .then((postSingleCommentFollowers) => {
      res.locals.postSingleCommentFollowers = postSingleCommentFollowers;

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
      message: post.message.replace(cutTextRegExp, '$1'),
      context: post.context,
      push: true,
    },
  };
  res.locals.eventData = {
    post,
  };

  return next();
};
const postArchivedNotificationData = (req, res, next) => {
  const {
    post_id,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    post_id,
  };

  return next();
};
const postCommentAddedNotificationData = (req, res, next) => {
  const {
    post,
    comment_id,
  } = res.locals;
  const comment = post.comments[comment_id];

  res.locals.notificationData = {
    target: {
      id: post.id,
    },
    meta: {
      user_ids: uniqueCommentUserIds(post.comments),
      message: post.message.replace(cutTextRegExp, '$1'),
      context: post.context,
      type: post.type,
      created_by: comment.created_by,
    },
  };
  res.locals.eventData = {
    post_id: post.id,
    comment: post.comments[comment_id],
  };

  return next();
};
const postCommentMentionNotificationData = (req, res, next) => {
  const {
    post,
    comment_id,
  } = res.locals;
  const comment = post.comments[comment_id];

  res.locals.notificationData = {
    target: {
      id: post.id,
    },
    meta: {
      message: post.message.replace(cutTextRegExp, '$1'),
      mentioned_by: comment.created_by,
      push: true,
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
  } = res.locals;
  const lastReaction = post.reactions.find(r => r.created_by === user_id);

  if (!lastReaction) {
    res.locals.notificationData = null;
    res.locals.eventData = null;

    return next();
  }

  res.locals.notificationData = {
    target: {
      id: post.id,
    },
    meta: {
      last_reaction: lastReaction,
      user_ids: post.reactions.map(r => r.created_by),
      message: post.message.replace(cutTextRegExp, '$1'),
      context: post.context,
      type: post.type,
    },
  };
  res.locals.eventData = {
    post_id: post.id,
    reaction: lastReaction,
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
    postSingleCommentFollowers,
  } = res.locals;
  const {
    comment,
  } = postSingleCommentFollowers;
  const lastReaction = comment.reactions.find(r => r.created_by === user_id);

  if (!lastReaction) {
    res.locals.notificationData = null;
    res.locals.eventData = null;

    return next();
  }

  res.locals.notificationData = {
    target: {
      comment_id,
      id: post_id,
    },
    meta: {
      last_reaction: lastReaction,
      user_ids: comment.reactions.map(r => r.created_by),
      message: comment.message.replace(cutTextRegExp, '$1'),
    },
  };
  res.locals.eventData = {
    post_id,
    comment_id,
    reaction: lastReaction,
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
const postFollowedUnfollowedNotificationData = (req, res, next) => {
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
const postCreatedPushNotificationData = (req, res, next) => {
  const {
    user,
    post,
  } = res.locals;

  res.locals.pushMessage = {
    contents: { en: post.message },
    headings: { en: `${user.profile.first_name} tagged you on ${getPrefixForType(post.type)}${post.type}` },
  };
  res.locals.pushTargetId = post.id;

  return next();
};
const postAddCommentMentionPushNotificationData = (req, res, next) => {
  const {
    user,
    post,
    comment_id,
  } = res.locals;
  const comment = post.comments[comment_id];

  res.locals.pushMessage = {
    contents: { en: comment.message.replace(/<![A-Z0-9]*\|(.*?)>/gi, '$1') },
    headings: { en: `${user.profile.first_name} mentioned you in a comment` },
  };
  res.locals.pushTargetId = post.id;

  return next();
};
const postAddCommentCreatedByPushNotificationData = (req, res, next) => {
  const {
    user,
    post,
    comment_id,
  } = res.locals;
  const comment = post.comments[comment_id];

  res.locals.pushMessage = {
    contents: { en: comment.message.replace(/<![A-Z0-9]*\|(.*?)>/gi, '$1') },
    headings: { en: `${user.profile.first_name} commented on your ${post.type}` },
  };
  res.locals.pushTargetId = post.id;

  return next();
};

export {
  postsGetSingle,
  postsGetSingleCommentFollowers,
  postCreatedNotificationData,
  postCommentAddedNotificationData,
  postReactionAddedNotificationData,
  postReactionRemovedNotificationData,
  postCommentReactionAddedNotificationData,
  postCommentReactionRemovedNotificationData,
  postArchivedNotificationData,
  postFollowedUnfollowedNotificationData,
  postCommentMentionNotificationData,
  postCreatedPushNotificationData,
  postAddCommentMentionPushNotificationData,
  postAddCommentCreatedByPushNotificationData,
};
