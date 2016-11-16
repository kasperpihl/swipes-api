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

const addPermissionsToALink = ({ userId, checksum, permission }) => {
  const permissionPart = shortid.generate();
  const q = r.table('links_permissions').insert({
    id: permissionPart,
    link_id: checksum,
    user_id: userId,
    permission: permission
  }, {
    returnChanges: true
  });

  return db.rethinkQuery(q);
}

const createLink = ({ meta, insert_doc }) => {
  const q =
    r.table('links')
      .insert(insert_doc, {
        returnChanges: 'always',
        conflict: (id, oldDoc, newDoc) => {
          return r.branch(
            r.expr(meta).ne(null),
            oldDoc,
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
