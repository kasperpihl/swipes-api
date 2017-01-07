import shortid from 'shortid';
import r from 'rethinkdb';
import db from '../../../../db';

const findLinkPermissionsById = (shortUrl) => {
  const q =
    r.table('links_permissions')
      .getAll(shortUrl)
      .eqJoin('link_id', r.table('links'))
      .zip();

  return db.rethinkQuery(q);
};
const findLinkByChecksum = (checksum) => {
  const q = r.table('links').get(checksum);

  return db.rethinkQuery(q);
};
const findLinksFromIds = (shareIds) => {
  const q =
    r.db('swipes').table('links_permissions')
      .getAll(r.args(shareIds))
      .eqJoin('link_id', r.db('swipes').table('links'))
      .map(doc => ({
        left: doc('left').without('link_id'),
        right: doc('right').without('id', 'type', 'short_url'),
      }))
      .zip()
      .map(l => l.merge(() => ({ short_url: l('id') })))
      .without('id');
  return db.rethinkQuery(q);
};

const addPermissionsToALink = ({ user_id, checksum, permission }) => {
  const permissionPart = shortid.generate();
  const q = r.table('links_permissions').insert({
    user_id,
    permission,
    id: permissionPart,
    link_id: checksum,
  }, {
    returnChanges: true,
  });

  return db.rethinkQuery(q);
};
const createLink = ({ meta, insert_doc }) => {
  insert_doc.last_updated = r.now();

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
};

export {
  findLinkPermissionsById,
  findLinkByChecksum,
  findLinksFromIds,
  addPermissionsToALink,
  createLink,
};
