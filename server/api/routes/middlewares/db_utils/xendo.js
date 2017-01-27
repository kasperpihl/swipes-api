import r from 'rethinkdb';
import {
  string,
  funcWrap,
} from 'valjs';
import db from '../../../../db';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

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

  return db.rethinkQuery(q);
});
const dbXendoRemoveService = funcWrap([
  string.require(),
], (err, xendoUserServiceId) => {
  if (err) {
    throw new SwipesError(`dbXendoRemoveService: ${err}`);
  }

  const q =
    r.table('xendo_user_services')
      .getAll(xendoUserServiceId, { index: 'service_id' })
      .delete();

  return db.rethinkQuery(q);
});

export {
  dbXendoGetService,
  dbXendoRemoveService,
};
