import Promise from 'bluebird';
import {
  string,
  bool,
} from 'valjs';
import {
  valLocals,
} from '../../utils';
import initMe from './db_utils/init';
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
  activated: true,
  created_at: new Date(),
  email: 'sofi@swipesapp.com',
  is_sofi: true,
  id: 'USOFI',
  organizations: [
    'O5767IOYF',
  ],
  profile: {
    first_name: 'S.O.F.I.',
    photos: {
      '192x192': 'https://s3.amazonaws.com/cdn.swipesapp.com/sofi/swipes-sofi.png',
      '64x64': 'https://s3.amazonaws.com/cdn.swipesapp.com/sofi/swipes-sofi.png',
      '96x96': 'https://s3.amazonaws.com/cdn.swipesapp.com/sofi/swipes-sofi.png',
      original: 'https://s3.amazonaws.com/cdn.swipesapp.com/sofi/swipes-sofi.png',
    },
  },
  services: [],
  settings: {
    onboarding: {
      completed: {
        'create-account': true,
      },
      order: [
        'create-account',
        'personalize-swipes',
        'watch-introduction-video',
        'create-milestone',
        'article-collect-feedback',
        'invite-team',
      ],
    },
    pinned_goals: [],
    starred_goals: [],
    subscriptions: {
      goal_notify: true,
    },
  },
  updated_at: new Date(),
};
const initGetData = valLocals('initGetData', {
  user_id: string.require(),
  timestamp: string.format('iso8601').require(),
  full_fetch: bool.require(),
  without_notes: bool,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    timestamp,
    full_fetch,
    without_notes,
  } = res.locals;
  const promiseArrayQ = [
    initMe(user_id, timestamp, full_fetch, without_notes),
    servicesGetAll(timestamp, full_fetch),
    dbNotificationsGetAllByIdOrderByTs({
      user_id,
      filter: { sender: false },
      filterDefaultOption: true,
      timestamp,
    }),
    dbNotificationsGetAllByIdOrderByTs({
      user_id,
      filter: { sender: true },
      filterDefaultOption: false,
      timestamp,
    }),
    dbOnboardingGetAll(timestamp),
  ];

  const now = new Date().toISOString();

  Promise.all(promiseArrayQ)
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

export default initGetData;
