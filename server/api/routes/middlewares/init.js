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

const initGetData = valLocals('initGetData', {
  user_id: string.require(),
  without_notes: bool,
  timestamp: string.format('iso8601'),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    without_notes,
    timestamp,
  } = res.locals;
  const promiseArrayQ = [
    initMe(user_id, without_notes, timestamp),
    servicesGetAll(),
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
    dbOnboardingGetAll(),
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

      if (me.organizations.length > 0) {
        users = me.organizations[0].users;

        // We don't want duplication of that data served on the client;
        delete me.organizations[0].users;
      }

      if (me.goals.length > 0) {
        goals = me.goals;

        // We don't want duplication of that data served on the client;
        delete me.goals;
      }

      if (me.milestones.length > 0) {
        milestones = me.milestones;

        // We don't want duplication of that data served on the client;
        delete me.milestones;
      }

      if (me.ways.length > 0) {
        ways = me.ways;

        // We don't want duplication of that data served on the client;
        delete me.ways;
      }

      if (me.notes && me.notes.length > 0) {
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
        timestamp: now,
        services: data[1],
        notifications: data[2].concat(data[3]),
        onboarding: data[4],
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});

export default initGetData;
