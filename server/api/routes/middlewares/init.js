import Promise from 'bluebird';
import {
  string,
  object,
  bool,
} from 'valjs';
import {
  valLocals,
} from '../../utils';
import {
  dbInit,
  dbInitWithoutOrganization,
} from './db_utils/init';
import {
  servicesGetAll,
} from './db_utils/services';
import {
  dbNotificationsGetAllByIdOrderByTs,
} from './db_utils/notifications';
import {
  dbOnboardingGetAll,
} from './db_utils/onboarding';

const SOFI = {
  created_at: new Date(),
  email: 'sofi@swipesapp.com',
  is_sofi: true,
  id: 'USOFI',
  profile: {
    first_name: 'S.O.F.I.',
    photos: {
      '192x192': 'https://s3.amazonaws.com/cdn.swipesapp.com/sofi/swipes-sofi.png',
      '64x64': 'https://s3.amazonaws.com/cdn.swipesapp.com/sofi/swipes-sofi.png',
      '96x96': 'https://s3.amazonaws.com/cdn.swipesapp.com/sofi/swipes-sofi.png',
      original: 'https://s3.amazonaws.com/cdn.swipesapp.com/sofi/swipes-sofi.png',
    },
  },
  updated_at: new Date(),
};
const init = valLocals('init', {
  user_id: string.require(),
  user: object.require(),
  timestamp: string.format('iso8601').require(),
  full_fetch: bool.require(),
  without_notes: bool,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    user,
    timestamp,
    full_fetch,
    without_notes,
  } = res.locals;

  if (!(user.organizations.length > 0)) {
    return next();
  }

  const organization_id = user.organizations[0];
  const promiseArrayQ = [
    dbInit(user_id, timestamp, full_fetch, without_notes),
    servicesGetAll(timestamp, full_fetch),
    dbNotificationsGetAllByIdOrderByTs({
      user_id,
      organization_id,
      filter: { sender: false },
      filterDefaultOption: true,
      timestamp,
    }),
    dbNotificationsGetAllByIdOrderByTs({
      user_id,
      organization_id,
      filter: { sender: true },
      filterDefaultOption: false,
      timestamp,
    }),
    dbOnboardingGetAll(timestamp),
  ];

  const now = new Date().toISOString();

  return Promise.all(promiseArrayQ)
    .then((data) => {
      const me = data[0];
      let users = [];
      let goals = [];
      let milestones = [];
      let ways = [];
      let notes = [];
      let posts = [];

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

      if (me.goals) {
        goals = me.goals;

        // We don't want duplication of that data served on the client;
        delete me.goals;
      }

      if (me.posts) {
        posts = me.posts;

        // We don't want duplication of that data served on the client;
        delete me.posts;
      }

      if (me.milestones) {
        milestones = me.milestones;

        // We don't want duplication of that data served on the client;
        delete me.milestones;
      }

      if (me.ways) {
        ways = me.ways;

        // We don't want duplication of that data served on the client;
        delete me.ways;
      }

      if (me.notes) {
        notes = me.notes;

        // We don't want duplication of that data served on the client;
        delete me.notes;
      }

      me.has_organization = true;

      setLocals({
        me,
        users,
        goals,
        milestones,
        ways,
        notes,
        posts,
        timestamp: now,
        services: data[1],
        notifications: data[2].concat(data[3]),
        onboarding: data[4],
        sofi: SOFI,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const initWithoutOrganization = valLocals('initWithoutOrganization', {
  user_id: string.require(),
  user: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    user,
  } = res.locals;

  if (user.organizations.length > 0) {
    return next();
  }

  return dbInitWithoutOrganization(user_id)
    .then((me) => {
      const now = new Date().toISOString();

      me.has_organization = false;

      setLocals({
        me,
        timestamp: now,
        sofi: SOFI,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});

export {
  init,
  initWithoutOrganization,
};
