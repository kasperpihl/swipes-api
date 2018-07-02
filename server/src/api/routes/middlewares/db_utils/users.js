import r from 'rethinkdb';
import {
  string,
  object,
  array,
  funcWrap,
} from 'valjs';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import SwipesError from 'src/utils/SwipesError';

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

  return dbRunQuery(q);
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

  return dbRunQuery(q);
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

  return dbRunQuery(q);
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

  return dbRunQuery(q);
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

  return dbRunQuery(q);
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

  return dbRunQuery(q);
});
const dbUsersGetByEmailWithoutFields = funcWrap([
  object.as({
    email: string.require(),
    fields: array.of(string, object).require(),
  }).require(),
], (err, { email, fields }) => {
  if (err) {
    throw new SwipesError(`dbUsersGetByEmailWithoutFields: ${err}`);
  }

  let q = r.table('users').filter({
    email,
  });

  if (fields.length > 0) {
    q = q.without(fields);
  }

  return dbRunQuery(q);
});
const dbUsersAddOrganization = funcWrap([
  object.as({
    user_id: string.require(),
    organization_id: string.require(),
  }).require(),
], (err, { user_id, organization_id }) => {
  if (err) {
    throw new SwipesError(`dbUsersAddOrganization: ${err}`);
  }

  const q =
    r.table('users')
      .get(user_id)
      .update({
        organizations: [organization_id],
        pending_organizations: r.row('pending_organizations').default([]).difference([organization_id]),
        updated_at: r.now(),
      });

  return dbRunQuery(q);
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

  return dbRunQuery(q);
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
  });

  return dbRunQuery(q);
});
const dbUsersConfirmEmail = funcWrap([
  object.as({
    user_id: string.require(),
  }).require(),
], (err, { user_id }) => {
  if (err) {
    throw new SwipesError(`dbUsersActivateAfterSignUp: ${err}`);
  }

  const q = r.table('users').get(user_id).update({
    confirmed: true,
    updated_at: r.now(),
  });

  return dbRunQuery(q);
});
const dbUsersAddPendingOrganization = funcWrap([
  object.as({
    user_id: string.require(),
    organization_id: string.require(),
  }).require(),
], (err, { user_id, organization_id }) => {
  if (err) {
    throw new SwipesError(`dbUsersAddPendingOrganization: ${err}`);
  }

  const q =
  r.table('organizations')
    .get(organization_id)
    .update({
      pending_users: r.row('pending_users').default([]).setUnion([user_id]),
      disabled_users: r.row('disabled_users').default([]).difference([user_id]),
      active_users: r.row('active_users').default([]).difference([user_id]),
      updated_at: r.now(),
    }, {
      returnChanges: true,
    }).do((result) => {
      return r.table('users').get(user_id).update((user) => {
        return {
          pending_organizations: user('pending_organizations').default([]).setUnion([organization_id]),
        };
      }).do(() => {
        return result;
      });
    });

  return dbRunQuery(q);
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

  return dbRunQuery(q);
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

  return dbRunQuery(q);
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

  return dbRunQuery(q);
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
  dbUsersAddPendingOrganization,
  dbUsersConfirmEmail,
  dbUsersGetByEmailWithoutFields,
};
