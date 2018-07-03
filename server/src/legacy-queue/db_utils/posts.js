import r from 'rethinkdb';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const dbPostsGetSingle = ({ post_id }) => {
  const q = r.table('posts').get(post_id);

  return dbRunQuery(q);
};
const dbPostsGetSingleCommentFollowers = ({ post_id, comment_id }) => {
  const q = r.db('swipes').table('posts').get(post_id).do((post) => {
    return {
      comment: post('comments')(comment_id).default(null),
      followers: post('followers'),
    };
  });

  return dbRunQuery(q);
};

export {
  dbPostsGetSingle,
  dbPostsGetSingleCommentFollowers,
};
