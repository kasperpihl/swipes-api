"use strict";

import r from 'rethinkdb';
import db from '../../../../db';

const dbXendoGetService = (user_id, account_id) => {
  const q =
    r.table('xendo_user_services')
      .getAll([account_id, user_id], {index: 'service_and_user_id'});

  return db.rethinkQuery(q);
}

const dbXendoRemoveService = (xendoUserServiceId) => {
  const q =
    r.table('xendo_user_services')
      .getAll(xendoUserServiceId, {index: 'service_id'})
      .delete();

  return db.rethinkQuery(q);
}

export {
  dbXendoGetService,
  dbXendoRemoveService
}
