"use strict";

import Promise from 'bluebird';
import r from 'rethinkdb';
import db from '../../../../db';

const dropboxGetAuthDataByAccounts = ({ accounts }) => {
  const q = r.table('users')
    .concatMap((user) => {
      return user('services').merge({user_id: user('id')})
    }).filter((service) => {
      return r.contains(accounts, service('id'))
    })

  return db.rethinkQuery(q);
}

const asanaGetAuthDataByAccountId = ({ accountId }) => {
  const q = r.table('users')
    .concatMap((user) => {
      return user('services').merge({user_id: user('id')})
    }).filter((service) => {
      return service('id').eq(r.expr(accountId).coerceTo('number'));
    })

  return db.rethinkQuery(q);
}

export {
  dropboxGetAuthDataByAccounts,
  asanaGetAuthDataByAccountId
}
