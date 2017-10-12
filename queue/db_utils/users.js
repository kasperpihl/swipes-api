import r from 'rethinkdb';
import db from '../db';

const dbUsersGetSingleWithOrganizations = ({ user_id }) => {
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
};
const dbUsersGetMultipleWithFields = ({ user_ids, fields }) => {
  const q =
    r.table('users')
      .getAll(...user_ids)
      .pluck(...fields);

  return db.rethinkQuery(q);
};
const dbUsersGetSingleWithFields = ({ user_id, fields }) => {
  const q =
    r.table('users')
      .get(user_id)
      .pluck(...fields);

  return db.rethinkQuery(q);
};

export {
  dbUsersGetSingleWithOrganizations,
  dbUsersGetMultipleWithFields,
  dbUsersGetSingleWithFields,
};
