import r from 'rethinkdb';
import {
  string,
  funcWrap,
} from 'valjs';
import db from '../../../../db';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const servicesGetAll = () => {
  const q = r.table('services');

  return db.rethinkQuery(q);
};
const getServiceByName = funcWrap([
  string.require(),
], (err, serviceName) => {
  if (err) {
    throw new SwipesError(`getServiceByName: ${err}`);
  }

  const q = r.table('services')
    .getAll(serviceName, { index: 'name' })
    .nth(0)
    .default(null);

  return db.rethinkQuery(q);
});

export {
  servicesGetAll,
  getServiceByName,
};
