import r from 'rethinkdb';
import {
  string,
  object,
  array,
  funcWrap,
} from 'valjs';
import db from '../../../../db';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const dbUsersGetService = funcWrap([
  string.require(),
  string.require(),
], (err, user_id, account_id) => {
  if (err) {
    throw new SwipesError(`dbUsersGetService: ${err}`);
  }

  const q =
    r.table('users')
      .get(user_id)('services')
      .filter((service) => {
        return service('id').eq(account_id);
      })
      .nth(0);

  return db.rethinkQuery(q);
});
const dbUsersRemoveService = funcWrap([
  string.require(),
  string.require(),
], (err, user_id, account_id) => {
  if (err) {
    throw new SwipesError(`dbUsersRemoveService: ${err}`);
  }

  const q =
    r.table('users')
      .get(user_id)
      .update({
        services: r.row('services')
          .filter((service) => {
            return service('id').ne(account_id);
          }),
        updated_at: r.now(),
      });

  return db.rethinkQuery(q);
});
const dbUsersAddSevice = funcWrap([
  object.as({
    user_id: string.require(),
    service: object.require(),
  }).require(),
], (err, { user_id, service }) => {
  if (err) {
    throw new SwipesError(`dbUsersAddSevice: ${err}`);
  }

  const q = r.table('users').get(user_id).update((user) => {
    return {
      services:
        user('services')
          .default([])
          .filter((s) => {
            return s('id')
                    .eq(service.id)
                    .and(s('service_id').eq(service.service_id))
                    .not();
          })
          .append(service),
      updated_at: r.now(),
    };
  });

  return db.rethinkQuery(q);
});
const dbUsersGetServiceWithAuth = funcWrap([
  object.as({
    user_id: string.require(),
    service_name: string.require(),
    account_id: string.require(),
  }).require(),
], (err, { user_id, service_name, account_id }) => {
  if (err) {
    throw new SwipesError(`dbUsersGetServiceWithAuth: ${err}`);
  }

  const filter = {
    id: account_id,
    service_name,
  };

  const q = r.table('users')
    .get(user_id)('services')
    .default([])
    .filter(filter)
    .limit(1)
    .pluck('auth_data', 'service_id', 'id', 'service_name')
    .eqJoin('service_id', r.table('services'), { index: 'id' })
    .without([{ right: 'id' }, { right: 'title' }])
    .zip();

  return db.rethinkQuery(q);
});
const dbUsersGetSingleWithOrganizations = funcWrap([
  object.as({
    user_id: string.require(),
  }).require(),
], (err, { user_id }) => {
  if (err) {
    throw new SwipesError(`dbUsersGetSingleWithOrganizations: ${err}`);
  }

  const q =
    r.table('users')
      .get(user_id)
      .without(['password', 'xendoCredentials', { services: 'auth_data' }])
      .merge({
        organizations:
          r.table('organizations')
            .getAll(r.args(r.row('organizations')))
            .coerceTo('ARRAY'),
      });

  return db.rethinkQuery(q);
});
const dbUsersGetByEmailWithFields = funcWrap([
  object.as({
    email: string.require(),
    fields: array.of(string).require(),
  }).require(),
], (err, { email, fields }) => {
  if (err) {
    throw new SwipesError(`dbUsersGetByEmailWithFields: ${err}`);
  }

  let q = r.table('users').filter({
    email,
  });

  if (fields.length > 0) {
    q = q.pluck(...fields);
  }

  return db.rethinkQuery(q);
});
const dbUsersAddOrganization = funcWrap([
  object.as({
    user_id: string.require(),
    organizationId: string.require(),
  }).require(),
], (err, { user_id, organizationId }) => {
  if (err) {
    throw new SwipesError(`dbUsersAddOrganization: ${err}`);
  }

  const q =
    r.table('users')
      .get(user_id)
      .update({
        organizations: r.row('organizations').default([]).setUnion([organizationId]),
        updated_at: r.now(),
      });

  return db.rethinkQuery(q);
});
const dbUsersCreate = funcWrap([
  object.as({
    user: object.require(),
  }).require(),
], (err, { user }) => {
  if (err) {
    throw new SwipesError(`dbUsersCreate: ${err}`);
  }

  const q = r.table('users').insert(user, { returnChanges: true });

  return db.rethinkQuery(q);
});
const dbUsersActivateAfterSignUp = funcWrap([
  object.as({
    profile: object.require(),
    user_id: string.require(),
    password: string.require(),
  }).require(),
], (err, { profile, user_id, password }) => {
  if (err) {
    throw new SwipesError(`dbUsersActivateAfterSignUp: ${err}`);
  }

  const q = r.table('users').get(user_id).update({
    password,
    profile,
    activated: true,
    updated_at: r.now(),
  }, {
    returnChanges: 'always',
  })
  .do((result) => {
    return result('changes').nth(0)('new_val');
  })
  .do((user) => {
    return r.table('organizations').get(user('organizations').nth(0)).update((organization) => {
      return {
        active_users: organization('active_users').default([]).setUnion([user('id')]),
        pending_users: organization('pending_users').default([]).difference([user('id')]),
        updated_at: r.now(),
      };
    });
  });

  return db.rethinkQuery(q);
});
const dbUsersGetByEmail = funcWrap([
  object.as({
    email: string.format('email').require(),
  }).require(),
], (err, { email }) => {
  if (err) {
    throw new SwipesError(`dbUsersGetByEmail: ${err}`);
  }

  const q = r.table('users').getAll(email, { index: 'email' });

  return db.rethinkQuery(q);
});
const dbUsersResetPassword = funcWrap([
  object.as({
    user_id: string.require(),
    password: string.require(),
  }).require(),
], (err, { user_id, password }) => {
  if (err) {
    throw new SwipesError(`dbUsersResetPassword: ${err}`);
  }

  const q = r.table('users').get(user_id).update({
    password,
    updated_at: r.now(),
  });

  return db.rethinkQuery(q);
});
const dbUsersGetByIdWithFields = funcWrap([
  object.as({
    user_id: string.require(),
    fields: array.of(string).require(),
  }).require(),
], (err, { user_id, fields }) => {
  if (err) {
    throw new SwipesError(`dbUsersGetByIdWithFields: ${err}`);
  }

  let q = r.table('users').get(user_id);

  if (fields.length > 0) {
    q = q.pluck(...fields);
  }

  return db.rethinkQuery(q);
});

export {
  dbUsersGetService,
  dbUsersRemoveService,
  dbUsersAddSevice,
  dbUsersGetServiceWithAuth,
  dbUsersGetSingleWithOrganizations,
  dbUsersGetByEmailWithFields,
  dbUsersAddOrganization,
  dbUsersCreate,
  dbUsersActivateAfterSignUp,
  dbUsersGetByEmail,
  dbUsersResetPassword,
  dbUsersGetByIdWithFields,
};
