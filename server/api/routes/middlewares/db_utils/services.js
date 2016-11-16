"use strict";

import r from 'rethinkdb';
import db from '../../../../db';

const getServiceByManifestId = (manifestId) => {
  const q = r.table('services')
  	.getAll(manifestId, {index: 'manifest_id'})
  	.nth(0)
  	.default(null);

  return db.rethinkQuery(q);
}

const getServiceWithAuth = ({ user_id, manifest_id, account_id }) => {
  const filter = {
    id: account_id,
    service_name: manifest_id
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
  getServiceByManifestId,
  getServiceWithAuth,
  appendSeviceToUser
}
