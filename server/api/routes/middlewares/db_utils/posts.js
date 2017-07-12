import r from 'rethinkdb';
import {
  string,
  object,
  funcWrap,
} from 'valjs';
import db from '../../../../db';
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

  return db.rethinkQuery(q);
});

const dbPostsAddComment = funcWrap([
  object.as({
    user_id: string.require(),
    post_id: string.require(),
    comment: object.require(),
  }).require(),
], (err, { user_id, post_id, comment }) => {
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
        followers: r.row('followers').default([]).setUnion([user_id]),
        updated_at: r.now(),
      });

  return db.rethinkQuery(q);
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

  return db.rethinkQuery(q);
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

  return db.rethinkQuery(q);
});

export {
  dbPostsInsertSingle,
  dbPostsAddComment,
  dbPostsAddReaction,
  dbPostsRemoveReaction,
};
