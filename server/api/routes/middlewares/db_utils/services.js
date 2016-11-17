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

const getServiceWithAuth = ({ user_id, service_name, account_id }) => {
  const filter = {
    id: account_id,
    service_name
  }

	const q = r.table("users")
		.get(user_id)("services")
		.default([])
		.filter(filter)
		.limit(1)
		.pluck('authData', 'service_id', 'id', 'service_name')
		.eqJoin('service_id', r.table('services'), {index: 'id'})
		.without([{right:'id'}, {right:'title'}])
		.zip();

  return db.rethinkQuery(q);
}

const appendSeviceToUser = ({ user_id, serviceToAppend }) => {
  const q = r.table('users').get(user_id).update((user) => {
		return {
			services: user('services').default([]).append(serviceToAppend)
		}
	});

	return db.rethinkQuery(q);
}

export {
  servicesGetAll,
  getServiceByManifestId,
  getServiceWithAuth,
  appendSeviceToUser
}
