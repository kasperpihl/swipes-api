"use strict";

import r from 'rethinkdb';
import db from '../../../../db';

const dbUsersGetService = (userId, account_id) => {
  const coerceToNumber = isNaN(account_id) ? account_id : r.expr(account_id).coerceTo('number');
  const q =
    r.table('users')
      .get(userId)('services')
      .filter((service) => {
        return service('id').eq(coerceToNumber)
      })
      .nth(0)

  return db.rethinkQuery(q);
}

const dbUsersRemoveService = (userId, account_id) => {
  const coerceToNumber = isNaN(account_id) ? account_id : r.expr(account_id).coerceTo('number');
  const q =
    r.table('users')
      .get(userId)
      .update({services: r.row('services')
        .filter((service) => {
          return service('id').ne(coerceToNumber)
        })
      })

  return db.rethinkQuery(q);
}

export {
  dbUsersGetService,
  dbUsersRemoveService
}
