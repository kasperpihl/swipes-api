import r from 'rethinkdb';
import {
  string,
  bool,
  funcWrap,
} from 'valjs';
import db from '../../../../db';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const initMe = funcWrap([
  string.require(),
  string.format('iso8601').require(),
  bool.require(),
  bool,
], (err, user_id, timestamp, full_fetch, without_notes = false) => {
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
              .filter((goal) => {
                return goal('updated_at').during(r.ISO8601(timestamp).sub(3600), r.now().add(3600));
              })
              .filter((goal) => {
                return goal('archived').eq(false).or(goal('archived').eq(!full_fetch));
              })
              .coerceTo('ARRAY'),
        });
      })
      .do((user) => {
        return user.merge({
          milestones:
             r.table('milestones')
               .getAll(user('organizations')(0)('id'), { index: 'organization_id' })
              .filter((milestone) => {
                return milestone('updated_at').during(r.ISO8601(timestamp).sub(3600), r.now().add(3600));
              })
              .coerceTo('ARRAY'),
        });
      })
      .do((user) => {
        return user.merge({
          ways:
            r.table('ways')
              .getAll(user('organizations')(0)('id'), { index: 'organization_id' })
              .filter((way) => {
                return way('updated_at').during(r.ISO8601(timestamp).sub(3600), r.now().add(3600));
              })
              .filter((way) => {
                return way('archived').eq(false).or(way('archived').eq(!full_fetch));
              })
              .coerceTo('ARRAY'),
        });
      })
      .do((user) => {
        return r.branch(
          r.expr(without_notes).ne(true),
          user.merge({
            notes:
              r.table('notes')
                .getAll(user('organizations')(0)('id'), { index: 'organization_id' })
                .coerceTo('ARRAY'),
          }),
          user.merge({ notes: [] }),
        );
      })
      .do((user) => {
        return user.merge({
          organizations: user('organizations').map((organization) => {
            return organization.merge({
              users:
                r.table('users')
                  .getAll(r.args(organization('users')))
                  .filter((user) => {
                    return user('updated_at').during(r.ISO8601(timestamp).sub(3600), r.now().add(3600));
                  })
                  .without('password', 'organizations', 'services', 'xendoCredentials', 'settings')
                  .coerceTo('ARRAY'),
            });
          }),
        });
      });

  return db.rethinkQuery(q);
});

export default initMe;
