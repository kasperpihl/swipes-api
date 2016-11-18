"use strict";

import r from 'rethinkdb';
import db from '../../../../db';

const servicesGetAll = () => {
  const q = r.table('services');

  return db.rethinkQuery(q);
}

const getServiceByManifestId = (serviceName) => {
  const q = r.table('services')
  	.getAll(serviceName, {index: 'name'})
  	.nth(0)
  	.default(null);

  return db.rethinkQuery(q);
}

export {
  servicesGetAll,
  getServiceByManifestId
}
