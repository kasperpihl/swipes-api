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

const dbPostsGetAllByOrganization = funcWrap([
  object.as({
    organization_id: string.require(),
    timestamp: string.format('iso8601').require(),
  }).require(),
], (err, { organization_id, timestamp }) => {
  if (err) {
    throw new SwipesError(`dbPostsInsertSingle: ${err}`);
  }

  const q = r.table('posts')
    .getAll(organization_id, { index: 'organization_id' })
    .filter((notification) => {
      return notification('updated_at').during(r.ISO8601(timestamp).sub(3600), r.now().add(3600));
    })
    .orderBy(r.desc('updated_at'));

  return db.rethinkQuery(q);
});

export {
  dbPostsInsertSingle,
  dbPostsGetAllByOrganization,
};
