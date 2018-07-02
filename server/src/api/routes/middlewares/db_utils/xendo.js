import r from 'rethinkdb';
import {
  string,
  number,
  funcWrap,
} from 'valjs';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import SwipesError from 'src/utils/SwipesError';

const dbXendoGetService = funcWrap([
  string.require(),
  string.require(),
], (err, user_id, account_id) => {
  if (err) {
    throw new SwipesError(`dbXendoGetService: ${err}`);
  }

  const q =
    r.table('xendo_user_services')
      .getAll([account_id, user_id], { index: 'service_and_user_id' });

  return dbRunQuery(q);
});
const dbXendoRemoveService = funcWrap([
  number.require(),
], (err, xendoUserServiceId) => {
  if (err) {
    throw new SwipesError(`dbXendoRemoveService: ${err}`);
  }

  const q =
    r.table('xendo_user_services')
      .getAll(xendoUserServiceId, { index: 'service_id' })
      .delete();

  return dbRunQuery(q);
});

export {
  dbXendoGetService,
  dbXendoRemoveService,
};
