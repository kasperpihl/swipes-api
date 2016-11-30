"use strict";

import Promise from 'bluebird';
import shortid from 'shortid';
import r from 'rethinkdb';
import db from '../../../../db';

const findLinkPermissionsById = (shortUrl) => {
  const q =
    r.table('links_permissions')
      .getAll(shortUrl)
      .eqJoin('link_id', r.table('links'))
      .zip()

  return db.rethinkQuery(q);
}

const findLinkByChecksum = (checksum) => {
  const q = r.table('links').get(checksum);

  return db.rethinkQuery(q);
}

const addPermissionsToALink = ({ user_id, checksum, permission }) => {
  const permissionPart = shortid.generate();
  const q = r.table('links_permissions').insert({
    user_id,
    id: permissionPart,
    link_id: checksum,
    permission: permission
  }, {
    returnChanges: true
  });

  return db.rethinkQuery(q);
}

const createLink = ({ meta, insert_doc }) => {
  insert_doc.last_updated = r.now();

  const q =
    r.table('links')
      .insert(insert_doc, {
        returnChanges: 'always',
        conflict: (id, oldDoc, newDoc) => {
          return r.branch(
            // The meta variable comes from the client so to speak
            // In order to not overwrite data from the webhooks
            // we are doing that check when there is a conflict.
            r.expr(meta).ne(null),
            oldDoc.merge({
              last_updated: r.now()
            }),
            oldDoc.merge({
              last_updated: r.now(),
              meta: newDoc('meta')
            })
          )
        }
      });

  return db.rethinkQuery(q);
}

export {
  findLinkPermissionsById,
  findLinkByChecksum,
  addPermissionsToALink,
  createLink
}
