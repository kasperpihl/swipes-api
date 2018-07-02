import shortid from 'shortid';
import r from 'rethinkdb';
import {
  string,
  object,
  array,
  funcWrap,
} from 'valjs';
import db from '../../../../db';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const findLinkPermissionsById = funcWrap([
  string.require(),
], (err, shortUrl) => {
  if (err) {
    throw new SwipesError(`findLinkPermissionsById: ${err}`);
  }

  const q =
    r.table('links_permissions')
      .getAll(shortUrl)
      .eqJoin('link_id', r.table('links'))
      .zip();

  return db.rethinkQuery(q);
});
const findLinksFromIds = funcWrap([
  string.require(),
], (err, shareIds) => {
  if (err) {
    throw new SwipesError(`findLinksFromIds: ${err}`);
  }

  const q =
    r.db('swipes').table('links_permissions')
      .getAll(r.args(shareIds))
      .eqJoin('link_id', r.db('swipes').table('links'))
      .map(doc => ({
        left: doc('left').merge(l => ({ short_url: l('id') })).without('link_id'),
        right: doc('right').without('short_url'),
      }))
      .zip()
      .without('permission', 'checksum', 'user_id');
  return db.rethinkQuery(q);
});
const addPermissionsToALink = funcWrap([
  object.as({
    user_id: string.require(),
    checksum: string.require(),
    permission: object.require(),
  }).require(),
], (err, { user_id, checksum, permission }) => {
  if (err) {
    throw new SwipesError(`addPermissionsToALink: ${err}`);
  }

  const permissionPart = shortid.generate();
  const q = r.table('links_permissions').insert({
    permission,
    id: permissionPart,
    link_id: checksum,
    created_at: r.now(),
    done_by: user_id,
  }, {
    returnChanges: true,
  });

  return db.rethinkQuery(q);
});
const addPermissionsToALinks = funcWrap([
  object.as({
    user_id: string.require(),
    mappedPermissions: array.require(),
  }).require(),
], (err, { user_id, mappedPermissions }) => {
  if (err) {
    throw new SwipesError(`addPermissionsToALinks: ${err}`);
  }

  const insert_docs = [];

  mappedPermissions.forEach((item) => {
    const permissionPart = shortid.generate();
    insert_docs.push(Object.assign({}, item, {
      id: permissionPart,
      created_at: r.now(),
      done_by: user_id,
    }));
  });

  const q = r.table('links_permissions').insert(insert_docs, {
    returnChanges: true,
  });

  return db.rethinkQuery(q);
});
const createLink = funcWrap([
  object.as({
    meta: object.require(),
    insert_doc: object.require(),
  }).require(),
], (err, { meta, insert_doc }) => {
  if (err) {
    throw new SwipesError(`createLink: ${err}`);
  }

  insert_doc.created_at = r.now();
  insert_doc.updated_at = r.now();

  const q =
    r.table('links')
      .insert(insert_doc, {
        returnChanges: 'always',
        conflict: (id, oldDoc, newDoc) => r.branch(
          // The meta variable comes from the client so to speak
          // In order to not overwrite data from the webhooks
          // we are doing that check when there is a conflict.
          r.expr(meta).ne(null),
          oldDoc.merge({
            last_updated: r.now(),
          }),
          oldDoc.merge({
            last_updated: r.now(),
            meta: newDoc('meta'),
          }),
        ),
      });

  return db.rethinkQuery(q);
});
const createLinkBatch = funcWrap([
  object.as({
    insert_docs: array.require(),
  }).require(),
], (err, { insert_docs }) => {
  if (err) {
    throw new SwipesError(`createLinkBatch: ${err}`);
  }

  insert_docs.map((doc) => {
    return Object.assign(doc, {
      created_at: r.now(),
      updated_at: r.now(),
    });
  });

  const q =
    r.table('links')
      .insert(insert_docs, {
        returnChanges: 'always',
      });

  return db.rethinkQuery(q);
});

export {
  findLinkPermissionsById,
  findLinksFromIds,
  addPermissionsToALink,
  createLink,
  createLinkBatch,
  addPermissionsToALinks,
};