"use strict";

import r from 'rethinkdb';
import db from '../../../../db';

const initMe = (user_id) => {
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
      .do((user) => {
        return user.merge({
          goals:
            r.table('goals')
              .getAll(user('organizations')(0)('id'), {index: 'organization_id'})
              .filter({
                deleted: false
              })
              .coerceTo('ARRAY')
        })
      })
      .do((user) => {
        return user.merge({
          organizations: user('organizations').map((organization) => {
            return organization.merge({
            users:
              r.table('users')
                .getAll(r.args(organization("users")))
                .without('password', 'organizations', 'services', 'xendoCredentials')
                .coerceTo('ARRAY')
            })
          })
        })
      })

  return db.rethinkQuery(q);
}



export {
  initMe
}
