import dbPostsGetSingle from '../db_utils/posts';

const uniqueCommentUserIds = (comments) => {
  const userIds = [];
  const keys = Object.keys(comments);

  keys.forEach((key) => {
    const comment = comments[key];

    userIds.push(comment.created_by);
  });

  return new Set(userIds);
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
    user_id,
    post,
    comment_id,
  } = res.locals;

  res.locals.notificationData = {
    target: {
      id: post.id,
    },
    meta: {
      user_id,
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

export {
  postsGetSingle,
  postCreatedNotificationData,
  postCommentAddedNotificationData,
};
