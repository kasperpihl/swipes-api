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

export default dbUsersGetSingleWithOrganizations;
