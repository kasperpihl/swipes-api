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

const dbUsersAddSevice = ({ user_id, serviceToAppend }) => {
  const account_id = serviceToAppend.id;
  const coerceToNumber = isNaN(account_id) ? account_id : r.expr(account_id).coerceTo('number');
  const q = r.table('users').get(user_id).update((user) => {
		return {
			services:
        user('services')
          .default([])
          .filter((service) => {
            return service('id')
                    .ne(coerceToNumber)
                    .and(service('service_id').ne(serviceToAppend.service_id))
          })
          .append(serviceToAppend)
		}
	});

	return db.rethinkQuery(q);
}

const dbUsersGetServiceWithAuth = ({ user_id, service_name, account_id }) => {
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

export {
  dbUsersGetService,
  dbUsersRemoveService,
  dbUsersAddSevice,
  dbUsersGetServiceWithAuth
}
