"use strict";

import r from 'rethinkdb';
import db from '../../../../db';

const dbUsersGetService = (user_id, account_id) => {
  const coerceToNumber = isNaN(account_id) ? account_id : r.expr(account_id).coerceTo('number');
  const q =
    r.table('users')
      .get(user_id)('services')
      .filter((service) => {
        return service('id').eq(coerceToNumber)
      })
      .nth(0)

  return db.rethinkQuery(q);
}

const dbUsersRemoveService = (user_id, account_id) => {
  const coerceToNumber = isNaN(account_id) ? account_id : r.expr(account_id).coerceTo('number');
  const q =
    r.table('users')
      .get(user_id)
      .update({services: r.row('services')
        .filter((service) => {
          return service('id').ne(coerceToNumber)
        })
      })

  return db.rethinkQuery(q);
}

const dbUsersAddSevice = ({ user_id, service }) => {
  const account_id = service.id;
  const coerceToNumber = service.service_name !== 'asana' ? account_id : r.expr(account_id).coerceTo('number');
  const q = r.table('users').get(user_id).update((user) => {
		return {
			services:
        user('services')
          .default([])
          .filter((s) => {
            return s('id')
                    .ne(coerceToNumber)
                    .and(s('service_id').ne(service.service_id))
          })
          .append(service)
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
		.pluck('auth_data', 'service_id', 'id', 'service_name')
		.eqJoin('service_id', r.table('services'), {index: 'id'})
		.without([{right:'id'}, {right:'title'}])
		.zip();

  return db.rethinkQuery(q);
}

const dbUsersUpdateProfilePic = ({ user_id, profilePic }) => {
	const q = r.table('users').get(user_id).update({profile_pic: profilePic});

  return db.rethinkQuery(q);
}

const dbUsersGetSingleWithOrganizations = ({ user_id }) => {
  const q =
    r.table('users')
      .get(user_id)
      .without(['password', 'xendoCredentials', {'services': 'auth_data'}])
      .merge({
        organizations:
          r.table('organizations')
            .getAll(r.args(r.row("organizations")))
            .coerceTo('ARRAY')
      })

  return db.rethinkQuery(q);
}

export {
  dbUsersGetService,
  dbUsersRemoveService,
  dbUsersAddSevice,
  dbUsersGetServiceWithAuth,
  dbUsersUpdateProfilePic,
  dbUsersGetSingleWithOrganizations
}
