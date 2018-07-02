import r from 'rethinkdb';
import {
  string,
  object,
  array,
  funcWrap,
} from 'valjs';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const dbPostsInsertSingle = funcWrap([
  object.as({
    post: object.require(),
  }).require(),
], (err, { post }) => {
  if (err) {
    throw new SwipesError(`dbPostsInsertSingle: ${err}`);
  }

  const q = r.table('posts').insert(post);

  return dbRunQuery(q);
});

const dbPostsEditSingle = funcWrap([
  object.as({
    post_id: string.require(),
    message: string.min(1).require(),
    attachments: array.require(),
    tagged_users: array.require(),
    mention_ids: array.require(),
  }).require(),
], (err, {
  post_id, message, attachments, tagged_users, mention_ids,
}) => {
  if (err) {
    throw new SwipesError(`dbPostsEditSingle: ${err}`);
  }

  const q = r.table('posts').get(post_id).update({
    message,
    attachments,
    tagged_users,
    followers: r.row('followers').default([]).setUnion([...tagged_users, ...mention_ids]),
    updated_at: r.now(),
  }, {
    returnChanges: true,
  });

  return dbRunQuery(q);
});

const dbPostsFollow = funcWrap([
  object.as({
    user_id: string.require(),
    post_id: string.require(),
  }).require(),
], (err, { user_id, post_id }) => {
  if (err) {
    throw new SwipesError(`dbPostsFollow: ${err}`);
  }

  const q = r.table('posts').get(post_id).update({
    followers: r.row('followers').default([]).setUnion([user_id]),
    updated_at: r.now(),
  });

  return dbRunQuery(q);
});

const dbPostsUnfollow = funcWrap([
  object.as({
    user_id: string.require(),
    post_id: string.require(),
  }).require(),
], (err, { user_id, post_id }) => {
  if (err) {
    throw new SwipesError(`dbPostsUnfollow: ${err}`);
  }

  const q = r.table('posts').get(post_id).update({
    followers: r.row('followers').difference([user_id]),
    updated_at: r.now(),
  });

  return dbRunQuery(q);
});

const dbPostsArchiveSingle = funcWrap([
  object.as({
    post_id: string.require(),
  }).require(),
], (err, { post_id }) => {
  if (err) {
    throw new SwipesError(`dbPostsArchiveSingle: ${err}`);
  }

  const q = r.table('posts').get(post_id).update({
    archived: true,
    updated_at: r.now(),
  });

  return dbRunQuery(q);
});
const dbPostsAddComment = funcWrap([
  object.as({
    user_id: string.require(),
    post_id: string.require(),
    comment: object.require(),
    mention_ids: array.require(),
  }).require(),
], (err, {
  user_id, post_id, comment, mention_ids,
}) => {
  if (err) {
    throw new SwipesError(`dbPostsAddComment: ${err}`);
  }

  const q =
    r.table('posts')
      .get(post_id)
      .update({
        comments: r.row('comments').merge({
          [comment.id]: comment,
        }),
        followers: r.row('followers').default([]).setUnion([user_id, ...mention_ids]),
        updated_at: r.now(),
      });

  return dbRunQuery(q);
});
const dbPostsEditComment = funcWrap([
  object.as({
    post_id: string.require(),
    comment_id: string.require(),
    message: string.min(1).require(),
    attachments: array.of(object).require(),
    mention_ids: array.of(string).require(),
  }).require(),
], (err, {
  post_id, comment_id, message, attachments, mention_ids,
}) => {
  if (err) {
    throw new SwipesError(`dbPostsEditComment: ${err}`);
  }

  const q = r.table('posts').get(post_id).update((p) => {
    return p.merge({
      comments: p('comments').merge({
        [comment_id]: {
          message,
          attachments,
          updated_at: r.now(),
        },
      }),
      followers: p('followers').default([]).setUnion(mention_ids),
      updated_at: r.now(),
    });
  }, {
    returnChanges: true,
  });

  return dbRunQuery(q);
});
const dbPostsArchiveComment = funcWrap([
  object.as({
    user_id: string.require(),
    post_id: string.require(),
    comment_id: string.require(),
  }).require(),
], (err, { user_id, post_id, comment_id }) => {
  if (err) {
    throw new SwipesError(`dbPostsArchiveComment: ${err}`);
  }

  const q =
    r.db('swipes')
      .table('posts')
      .get(post_id)
      .update({
        comments: {
          [comment_id]: {
            archived: true,
            updated_at: r.now(),
            updated_by: user_id,
          },
        },
        updated_at: r.now(),
      });

  return dbRunQuery(q);
});

const dbPostsAddReaction = funcWrap([
  object.as({
    user_id: string.require(),
    post_id: string.require(),
    reaction: object.require(),
  }).require(),
], (err, { user_id, post_id, reaction }) => {
  if (err) {
    throw new SwipesError(`dbPostsAddReaction: ${err}`);
  }

  const q =
    r.table('posts')
      .get(post_id)
      .update({
        reactions: r.row('reactions').filter(r => r('created_by').ne(user_id)).prepend(reaction),
        updated_at: r.now(),
      });

  return dbRunQuery(q);
});
const dbPostsRemoveReaction = funcWrap([
  object.as({
    user_id: string.require(),
    post_id: string.require(),
  }).require(),
], (err, { user_id, post_id }) => {
  if (err) {
    throw new SwipesError(`dbPostsRemoveReaction: ${err}`);
  }

  const q =
    r.table('posts')
      .get(post_id)
      .update({
        reactions: r.row('reactions').filter(r => r('created_by').ne(user_id)),
        updated_at: r.now(),
      });

  return dbRunQuery(q);
});
const dbPostsCommentAddReaction = funcWrap([
  object.as({
    user_id: string.require(),
    post_id: string.require(),
    comment_id: string.require(),
    reaction: object.require(),
  }).require(),
], (err, {
  user_id, post_id, comment_id, reaction,
}) => {
  if (err) {
    throw new SwipesError(`dbPostsCommentAddReaction: ${err}`);
  }

  const q =
    r.table('posts')
      .get(post_id)
      .update((post) => {
        return post.merge({
          comments: {
            [comment_id]: post('comments')(comment_id).merge({
              reactions: post('comments')(comment_id)('reactions').filter(r => r('created_by').ne(user_id)).prepend(reaction),
            }),
          },
          updated_at: r.now(),
        });
      });

  return dbRunQuery(q);
});
const dbPostsCommentRemoveReaction = funcWrap([
  object.as({
    user_id: string.require(),
    post_id: string.require(),
    comment_id: string.require(),
  }).require(),
], (err, { user_id, post_id, comment_id }) => {
  if (err) {
    throw new SwipesError(`dbPostsCommentRemoveReaction: ${err}`);
  }

  const q =
    r.table('posts')
      .get(post_id)
      .update((post) => {
        return post.merge({
          comments: {
            [comment_id]: post('comments')(comment_id).merge({
              reactions: post('comments')(comment_id)('reactions').filter(r => r('created_by').ne(user_id)),
            }),
          },
          updated_at: r.now(),
        });
      });

  return dbRunQuery(q);
});

export {
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
};
