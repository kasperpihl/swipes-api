import r from 'rethinkdb';
import {
  string,
  funcWrap,
} from 'valjs';
import db from '../../../../db';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const servicesGetAll = funcWrap([
  string.format('iso8601').require(),
], (err, timestamp) => {
  if (err) {
    throw new SwipesError(`servicesGetAll: ${err}`);
  }

  const q =
    r.table('services')
      .filter((service) => {
        return service('updated_at').during(r.ISO8601(timestamp).sub(3600), r.now().add(3600));
      })
      .filter({ hidden: false });

  return db.rethinkQuery(q);
});
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
