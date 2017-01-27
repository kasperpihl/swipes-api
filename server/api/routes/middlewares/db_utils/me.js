import r from 'rethinkdb';
import {
  string,
  funcWrap,
} from 'valjs';
import db from '../../../../db';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const initMe = funcWrap([
  string.require(),
], (err, user_id) => {
  if (err) {
    throw new SwipesError(`initMe: ${err}`);
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
      })
      .do((user) => {
        return user.merge({
          goals:
            r.table('goals')
              .getAll(user('organizations')(0)('id'), { index: 'organization_id' })
              .filter({
                archived: false,
              })
              .coerceTo('ARRAY'),
        });
      })
      .do((user) => {
        return user.merge({
          milestones:
            r.table('milestones')
              .getAll(user('organizations')(0)('id'), { index: 'organization_id' })
              .filter({
                archived: false,
              })
              .coerceTo('ARRAY'),
        });
      })
      .do((user) => {
        return user.merge({
          ways:
            r.table('ways')
              .getAll(user('organizations')(0)('id'), { index: 'organization_id' })
              .filter({
                archived: false,
              })
              .coerceTo('ARRAY'),
        });
      })
      .do((user) => {
        return user.merge({
          notes:
            r.table('notes')
              .getAll(user('organizations')(0)('id'), { index: 'organization_id' })
              .coerceTo('ARRAY'),
        });
      })
      .do((user) => {
        return user.merge({
          organizations: user('organizations').map((organization) => {
            return organization.merge({
              users:
                r.table('users')
                  .getAll(r.args(organization('users')))
                  .without('password', 'organizations', 'services', 'xendoCredentials')
                  .coerceTo('ARRAY'),
            });
          }),
        });
      });

  return db.rethinkQuery(q);
});

export default initMe;
