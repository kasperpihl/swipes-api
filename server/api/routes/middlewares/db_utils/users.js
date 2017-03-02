import r from 'rethinkdb';
import {
  string,
  object,
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
      .update({ services: r.row('services')
        .filter((service) => {
          return service('id').ne(account_id);
        }),
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
const dbUsersUpdateProfilePic = funcWrap([
  object.as({
    user_id: string.require(),
    profilePic: string.require(),
  }).require(),
], (err, { user_id, profilePic }) => {
  if (err) {
    throw new SwipesError(`dbUsersUpdateProfilePic: ${err}`);
  }

  const q = r.table('users').get(user_id).update({ profile_pic: profilePic });

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
const dbUsersGetByEmailForSignIn = funcWrap([
  object.as({
    email: string.require(),
  }).require(),
], (err, { email }) => {
  if (err) {
    throw new SwipesError(`dbUsersGetByEmailForSignIn: ${err}`);
  }

  const q = r.table('users').filter({
    email,
  }).map((user) => {
    return {
      id: user('id'),
      password: user('password'),
    };
  });

  return db.rethinkQuery(q);
});

export {
  dbUsersGetService,
  dbUsersRemoveService,
  dbUsersAddSevice,
  dbUsersGetServiceWithAuth,
  dbUsersUpdateProfilePic,
  dbUsersGetSingleWithOrganizations,
  dbUsersGetByEmailForSignIn,
};
