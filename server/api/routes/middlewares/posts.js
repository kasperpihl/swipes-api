import {
  string,
  object,
  array,
} from 'valjs';
import {
  dbPostsInsertSingle,
  dbPostsEditSingle,
  dbPostsAddComment,
  dbPostsEditComment,
  dbPostsAddReaction,
  dbPostsRemoveReaction,
  dbPostsCommentAddReaction,
  dbPostsCommentRemoveReaction,
  dbPostsArchiveSingle,
  dbPostsUnfollow,
  dbPostsFollow,
  dbPostsArchiveComment,
} from './db_utils/posts';
import {
  generateSlackLikeId,
  valLocals,
} from '../../utils';

const postsCreate = valLocals('postsCreate', {
  user_id: string.require(),
  organization_id: string.require(),
  message: string.min(1).require(),
  attachments: array.of(object),
  tagged_users: array.of(string),
  context: object,
  reactions: array.of(object),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization_id,
    message,
    attachments = [],
    tagged_users = [],
    context = {},
    reactions = [],
  } = res.locals;

  const post = {
    organization_id,
    message,
    attachments,
    tagged_users,
    context,
    reactions,
    id: generateSlackLikeId('P'),
    created_at: new Date(),
    updated_at: new Date(),
    created_by: user_id,
    archived: false,
    followers: [...new Set([...[user_id], ...tagged_users])],
    comments: {},
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
const postsFollow = valLocals('postsFollow', {
  user_id: string.require(),
  post_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
  } = res.locals;

  dbPostsFollow({ user_id, post_id })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const postsEdit = valLocals('postsEdit', {
  post_id: string.require(),
  message: string.min(1).require(),
  attachments: array.of(object).require(),
  tagged_users: array.of(string).require(),
}, (req, res, next, setLocals) => {
  const {
    post_id,
    message,
    attachments,
    tagged_users,
  } = res.locals;

  dbPostsEditSingle({
    post_id,
    message,
    attachments,
    tagged_users,
  })
    .then((results) => {
      const changes = results.changes[0];
      const newPost = changes.new_val;
      const oldPost = changes.old_val;
      const newTaggedUsers = newPost.tagged_users;
      const oldTaggedUsers = oldPost.tagged_users;
      const diffTaggedUsers = newTaggedUsers.filter(a => !oldTaggedUsers.find(b => b === a));

      setLocals({
        post: newPost,
        organization_id: newPost.organization_id,
        tagged_users_diff: diffTaggedUsers,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const postsUnfollow = valLocals('postsUnfollow', {
  user_id: string.require(),
  post_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
  } = res.locals;

  dbPostsUnfollow({ user_id, post_id })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const postsArchiveSingle = valLocals('postsArchiveSingle', {
  post_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    post_id,
  } = res.locals;

  dbPostsArchiveSingle({ post_id })
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
const postsCreatedPushNotificationQueueMessage = valLocals('postsCreatedPushNotificationQueueMessage', {
  organization_id: string.require(),
  user_id: string.require(),
  post: object.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
    user_id,
    post,
  } = res.locals;
  const event_type = 'post_created_push_notification';
  const queueMessage = {
    organization_id,
    user_id,
    event_type,
    post_id: post.id,
  };

  setLocals({
    queueMessage,
    messageGroupId: post.id,
  });

  return next();
});
const postsEditedQueueMessage = valLocals('postsEditedQueueMessage', {
  user_id: string.require(),
  post: object.require(),
  tagged_users_diff: array.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post,
    tagged_users_diff,
  } = res.locals;
  const event_type = 'post_edited';
  const queueMessage = {
    user_id,
    event_type,
    tagged_users_diff,
    notification_id_sufix: `${post.id}-${event_type}`,
    post_id: post.id,
  };

  setLocals({
    queueMessage,
    messageGroupId: post.id,
  });

  return next();
});
const postsEditedPushNotificationQueueMessage = valLocals('postsEditedPushNotificationQueueMessage', {
  organization_id: string.require(),
  user_id: string.require(),
  post: object.require(),
  tagged_users_diff: array.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
    user_id,
    post,
    tagged_users_diff,
  } = res.locals;
  const event_type = 'post_created_push_notification';
  const queueMessage = {
    organization_id,
    user_id,
    tagged_users_diff,
    event_type,
    post_id: post.id,
  };

  setLocals({
    queueMessage,
    messageGroupId: post.id,
  });

  return next();
});
const postsUnfollowQueueMessage = valLocals('postsUnfollowQueueMessage', {
  user_id: string.require(),
  post_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
  } = res.locals;
  const event_type = 'post_unfollowed';
  const queueMessage = {
    user_id,
    post_id,
    event_type,
  };

  setLocals({
    queueMessage,
    messageGroupId: post_id,
  });

  return next();
});
const postsFollowQueueMessage = valLocals('postsFollowQueueMessage', {
  user_id: string.require(),
  post_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
  } = res.locals;
  const event_type = 'post_followed';
  const queueMessage = {
    user_id,
    post_id,
    event_type,
  };

  setLocals({
    queueMessage,
    messageGroupId: post_id,
  });

  return next();
});
const postsArchiveQueueMessage = valLocals('postsArchiveQueueMessage', {
  user_id: string.require(),
  post_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
  } = res.locals;
  const event_type = 'post_archived';
  const queueMessage = {
    user_id,
    post_id,
    event_type,
  };

  setLocals({
    queueMessage,
    messageGroupId: post_id,
  });

  return next();
});
const postsCreateComment = valLocals('postsCreateComment', {
  user_id: string.require(),
  message: string.require(),
  attachments: array.of(object),
  reactions: array.of(object),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    message,
    attachments = [],
    reactions = [],
  } = res.locals;

  const comment = {
    message,
    attachments,
    reactions,
    id: generateSlackLikeId('C'),
    created_at: new Date(),
    updated_at: new Date(),
    created_by: user_id,
    archived: false,
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
  mention_ids: array.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
    comment,
    mention_ids,
  } = res.locals;

  dbPostsAddComment({
    user_id, post_id, comment, mention_ids,
  })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const postsEditComment = valLocals('postsEditComment', {
  post_id: string.require(),
  comment_id: string.require(),
  message: string.min(1).require(),
  mention_ids: array.require(),
  attachments: array.require(),
}, (req, res, next, setLocals) => {
  const {
    post_id,
    comment_id,
    message,
    mention_ids,
    attachments,
  } = res.locals;

  dbPostsEditComment({
    post_id, comment_id, message, mention_ids, attachments,
  })
    .then((results) => {
      const changes = results.changes[0];
      const updatedPost = changes.new_val || changes.old_val;
      const {
        followers,
        comments,
      } = updatedPost;
      const comment = comments[comment_id];

      setLocals({
        followers,
        comment,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const postsMentionsParseComment = valLocals('postsMentionsParseComment', {
  comment: object.require(),
}, (req, res, next, setLocals) => {
  const {
    comment,
  } = res.locals;
  const regex = /<!(U[A-Z0-9]*)\|/gi;
  const mention_ids = [];
  let tempMatches = [];

  while ((tempMatches = regex.exec(comment.message)) !== null) {
    mention_ids.push(tempMatches[1]);
  }

  setLocals({
    mention_ids,
  });

  return next();
});
const postsAddCommentFollowersPushNotificationQueueMessage = valLocals('postsAddCommentFollowersPushNotificationQueueMessage', {
  user_id: string.require(),
  post_id: string.require(),
  comment: object.require(),
  mention_ids: array.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
    comment,
    mention_ids,
  } = res.locals;
  const event_type = 'post_comment_followers_push_notification';
  const queueMessage = {
    user_id,
    post_id,
    event_type,
    mention_ids,
    comment_id: comment.id,
  };

  setLocals({
    queueMessage,
    messageGroupId: post_id,
  });

  return next();
});
const postsAddCommentMentionsPushNotificationQueueMessage = valLocals('postsAddCommentMentionsPushNotificationQueueMessage', {
  user_id: string.require(),
  post_id: string.require(),
  comment: object.require(),
  mention_ids: array.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
    comment,
    mention_ids,
  } = res.locals;
  const event_type = 'post_comment_mention_push_notification';
  const queueMessage = {
    user_id,
    post_id,
    event_type,
    mention_ids,
    comment_id: comment.id,
  };

  setLocals({
    queueMessage,
    messageGroupId: post_id,
  });

  return next();
});
const postsAddCommentQueueMessage = valLocals('postsAddCommentQueueMessage', {
  user_id: string.require(),
  post_id: string.require(),
  comment: object.require(),
  mention_ids: array.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
    comment,
    mention_ids,
  } = res.locals;
  const event_type = 'post_comment_added';
  const queueMessage = {
    user_id,
    post_id,
    event_type,
    mention_ids,
    notification_id_sufix: `${post_id}-${event_type}`,
    comment_id: comment.id,
  };

  setLocals({
    queueMessage,
    messageGroupId: post_id,
  });

  return next();
});
const postsEditCommentQueueMessage = valLocals('postsEditCommentQueueMessage', {
  user_id: string.require(),
  post_id: string.require(),
  comment_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
    comment_id,
  } = res.locals;
  const event_type = 'post_comment_edited';
  const queueMessage = {
    user_id,
    post_id,
    comment_id,
    event_type,
    notification_id_sufix: `${post_id}-${event_type}`,
  };

  setLocals({
    queueMessage,
    messageGroupId: post_id,
  });

  return next();
});
const postsArchiveComment = valLocals('postsArchiveComment', {
  user_id: string.require(),
  post_id: string.require(),
  comment_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
    comment_id,
  } = res.locals;

  dbPostsArchiveComment({ user_id, post_id, comment_id })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const postsArchiveCommentQueueMessage = valLocals('postsArchiveCommentQueueMessage', {
  user_id: string.require(),
  post_id: string.require(),
  comment_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
    comment_id,
  } = res.locals;
  const event_type = 'comment_archived';
  const queueMessage = {
    user_id,
    post_id,
    comment_id,
    event_type,
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
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
  } = res.locals;
  const event_type = 'post_reaction_added';
  const queueMessage = {
    user_id,
    post_id,
    event_type,
    notification_id_sufix: `${post_id}-${event_type}`,
  };

  setLocals({
    queueMessage,
    messageGroupId: post_id,
  });

  return next();
});
const postsRemoveReaction = valLocals('postsRemoveReaction', {
  user_id: string.require(),
  post_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
  } = res.locals;

  dbPostsRemoveReaction({ user_id, post_id })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const postsRemoveReactionQueueMessage = valLocals('postsRemoveReactionQueueMessage', {
  user_id: string.require(),
  post_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
  } = res.locals;
  const event_type = 'post_reaction_removed';
  const queueMessage = {
    user_id,
    post_id,
    event_type,
  };

  setLocals({
    queueMessage,
    messageGroupId: post_id,
  });

  return next();
});
const postsCommentAddReaction = valLocals('postsCommentAddReaction', {
  user_id: string.require(),
  post_id: string.require(),
  comment_id: string.require(),
  reaction: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
    comment_id,
    reaction,
  } = res.locals;

  dbPostsCommentAddReaction({
    user_id, post_id, comment_id, reaction,
  })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const postsCommentAddReactionQueueMessage = valLocals('postsCommentAddReactionQueueMessage', {
  user_id: string.require(),
  post_id: string.require(),
  comment_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
    comment_id,
  } = res.locals;
  const event_type = 'post_comment_reaction_added';
  const queueMessage = {
    user_id,
    post_id,
    comment_id,
    event_type,
    notification_id_sufix: `${post_id}-${comment_id}-${event_type}`,
  };

  setLocals({
    queueMessage,
    messageGroupId: post_id,
  });

  return next();
});
const postsCommentRemoveReaction = valLocals('postsCommentRemoveReaction', {
  user_id: string.require(),
  post_id: string.require(),
  comment_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
    comment_id,
  } = res.locals;

  dbPostsCommentRemoveReaction({ user_id, post_id, comment_id })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const postsCommentRemoveReactionQueueMessage = valLocals('postsCommentRemoveReactionQueueMessage', {
  user_id: string.require(),
  post_id: string.require(),
  comment_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    post_id,
    comment_id,
  } = res.locals;
  const event_type = 'post_comment_reaction_removed';
  const queueMessage = {
    user_id,
    post_id,
    comment_id,
    event_type,
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
  postsEdit,
  postsEditedQueueMessage,
  postsEditedPushNotificationQueueMessage,
  postsCreateComment,
  postsAddComment,
  postsEditComment,
  postsAddCommentQueueMessage,
  postsEditCommentQueueMessage,
  postsArchiveComment,
  postsArchiveCommentQueueMessage,
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
  postsMentionsParseComment,
  postsCreatedPushNotificationQueueMessage,
  postsAddCommentFollowersPushNotificationQueueMessage,
  postsAddCommentMentionsPushNotificationQueueMessage,
};
