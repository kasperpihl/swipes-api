import dbPostsGetSingle from '../db_utils/posts';

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

export {
  postsGetSingle,
  postCreatedNotificationData,
};
