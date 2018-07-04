import r from 'rethinkdb';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const dbUsersGetSingleWithOrganizations = ({ user_id }) => {
  const q =
    r.table('users')
      .get(user_id)
      .without(['password', { services: 'auth_data' }])
      .merge({
        organizations:
          r.table('organizations')
            .getAll(r.args(r.row('organizations')))
            .coerceTo('ARRAY'),
      });

  return dbRunQuery(q);
};
const dbUsersGetMultipleWithFields = ({ user_ids, fields }) => {
  const q =
    r.table('users')
      .getAll(...user_ids)
      .pluck(...fields);

  return dbRunQuery(q);
};
const dbUsersGetSingleWithFields = ({ user_id, fields }) => {
  const q =
    r.table('users')
      .get(user_id)
      .pluck(...fields);

  return dbRunQuery(q);
};

export {
  dbUsersGetSingleWithOrganizations,
  dbUsersGetMultipleWithFields,
  dbUsersGetSingleWithFields,
};
