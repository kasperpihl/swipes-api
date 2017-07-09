import r from 'rethinkdb';
import db from '../db';

const dbPostsGetSingle = ({ post_id }) => {
  const q = r.table('posts').get(post_id);

  return db.rethinkQuery(q);
};

export default dbPostsGetSingle;
