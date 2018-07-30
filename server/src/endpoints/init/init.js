import r from 'rethinkdb';
import { bool, string, object, array } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import sofiCreate from 'src/utils/sofiCreate';

const defTs = new Date(1970, 1, 1).toISOString();

const expectedInput = {
  timestamp: string.format('iso8601'),
  without_notes: bool,
  organization_id: string.require(),
};
const expectedOutput = {
  me: object.require(),
  timestamp: string.format('iso8601').require(),
  full_fetch: bool.require(),
  sofi: object.require(),
  users: array.of(object),
  goals: array.of(object),
  milestones: array.of(object),
  ways: array.of(object),
  notes: array.of(object),
  notifications: array.of(object),
  onboarding: array.of(object),
  services: array.of(object),
};

export default endpointCreate({
  endpoint: '/init',
  expectedInput,
  expectedOutput,
}, async (req, res, next) => {
  const { user_id } = res.locals;
  
  const {
    timestamp = defTs,
    organization_id,
    without_notes = false,
  } = res.locals.input;

  const full_fetch = timestamp.startsWith('1970');

  // Fetch user first to see what the situation is
  const userQ = r.table('users')
                  .get(user_id)
                  .pluck('organizations', 'settings');

  const user = await dbRunQuery(userQ);

  if(user.organizations.indexOf(organization_id) === -1) {
    throw Error('not_authed');
  }

  const initQ = r.table('users')
      .get(user_id)
      // if we change this some day - check where we use this filtering
      // or make it global somehow
      .without(['password', { services: 'auth_data' }])
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
                .filter((note) => {
                  return note('updated_at').during(r.ISO8601(timestamp).sub(3600), r.now().add(3600));
                })
                .coerceTo('ARRAY'),
          }),
          user.merge({ notes: [] }),
        );
      })
      .do((user) => {
        return user.merge({
          organizations: user('organizations').map((organization) => {
            return organization.merge({
              active_users_real:
                r.table('users')
                  .getAll(r.args(organization('active_users').default([])))
                  .filter((user) => {
                    return user('updated_at').during(r.ISO8601(timestamp).sub(3600), r.now().add(3600));
                  })
                  .without('password', 'organizations', 'services', 'settings')
                  .coerceTo('ARRAY'),
            });
          }),
        });
      })
      .do((user) => {
        return user.merge({
          organizations: user('organizations').map((organization) => {
            return organization.merge({
              pending_users_real:
                r.table('users')
                  .getAll(r.args(organization('pending_users').default([])))
                  .filter((user) => {
                    return user('updated_at').during(r.ISO8601(timestamp).sub(3600), r.now().add(3600));
                  })
                  .without('password', 'organizations', 'services', 'settings')
                  .coerceTo('ARRAY'),
            });
          }),
        });
      })
      .do((user) => {
        return user.merge({
          organizations: user('organizations').map((organization) => {
            return organization.merge({
              disabled_users_real:
                r.table('users')
                  .getAll(r.args(organization('disabled_users').default([])))
                  .filter((user) => {
                    return user('updated_at').during(r.ISO8601(timestamp).sub(3600), r.now().add(3600));
                  })
                  .without('password', 'organizations', 'services', 'settings')
                  .coerceTo('ARRAY'),
            });
          }),
        });
      });

  

  const servicesQ = r.table('services')
      .filter((service) => {
        return service('updated_at').during(r.ISO8601(timestamp).sub(3600), r.now().add(3600));
      })
      .filter((service) => {
        return service('hidden').eq(false).or(service('hidden').eq(!full_fetch));
      });

  const notificationsQ = r.table('notifications')
      .getAll([user_id, organization_id], { index: 'user_id_organization_id' })
      .filter((notification) => {
        return notification('updated_at').during(r.ISO8601(timestamp).sub(3600), r.now().add(3600));
      })
      .orderBy(r.desc('updated_at'))
      .limit(100);

  const onboadingQ = r.table('onboarding').filter((item) => {
    return item('updated_at').during(r.ISO8601(timestamp).sub(3600), r.now().add(3600));
  });

  const discussionTs = user.settings.discussion_counter_ts || defTs;
  const discussionCounterQ = r.table('discussions')
      .orderBy({ index: r.desc('last_comment_at') })
      .filter(disc =>
        disc('organization_id')
          .eq(organization_id)
          .and(r.table('discussion_followers')
            .get(disc('id').add(`-${user_id}`)))
          .and(disc('archived').eq(false))
          .and(disc('last_comment_at').gt(r.ISO8601(discussionTs))))
      .pluck('id', 'last_comment_at')
      .map(obj => ({
        id: obj('id'),
        ts: obj('last_comment_at')
      }))
      .limit(10);

  const notificationTs = defTs;
  const notificationCounterQ = r.table('notifications')
      .getAll([user_id, organization_id], { index: 'user_id_organization_id' })
      .filter((notification) => {
        return notification('updated_at').gt(r.ISO8601(notificationTs));
      })
      .pluck('id', 'updated_at')
      .map(obj => ({
        id: obj('id'),
        ts: obj('updated_at')
      }))
      .limit(10);

  const now = new Date().toISOString();


  const result = await Promise.all([
    dbRunQuery(initQ),
    dbRunQuery(servicesQ),
    dbRunQuery(notificationsQ),
    dbRunQuery(onboadingQ),
    dbRunQuery(discussionCounterQ),
    dbRunQuery(notificationCounterQ),
  ]);

  const me = result[0];
  const services = result[1];
  const notifications = result[2];
  const onboarding = result[3];
  const counter = {
    discussion: result[4],
    notification: result[5],
    discussionTs: user.settings.discussion_counter_ts || null,
    notificationTs: user.settings.notification_counter_ts || null,
    myId: user_id,
  }
  let users = [];
  if (me.organizations.length > 0) {
    users = me.organizations[0].active_users_real;
    delete me.organizations[0].active_users_real;

    if (me.organizations[0].pending_users_real) {
      users = users.concat(me.organizations[0].pending_users_real || []);
      delete me.organizations[0].pending_users_real;
    }

    if (me.organizations[0].disabled_users_real) {
      users = users.concat(me.organizations[0].disabled_users_real || []);
      delete me.organizations[0].disabled_users_real;
    }
  }

  const goals = me.goals || [];
  const milestones = me.milestones || [];
  const notes = me.notes || [];
  const ways = me.ways || [];

  delete me.goals;
  delete me.milestones;
  delete me.ways;
  delete me.notes;

  // Create response data.
  res.locals.output = {
    me,
    users,
    goals,
    milestones,
    ways,
    services,
    notifications,
    onboarding,
    counter,
    notes,
    sofi: sofiCreate(),
    full_fetch,
    timestamp: now,
  };
});
