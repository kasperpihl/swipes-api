import Promise from 'bluebird';
import config from 'config';
import {
  string,
} from 'valjs';
import {
  valLocals,
} from '../../utils';
import initMe from './db_utils/me';
import {
  servicesGetAll,
} from './db_utils/services';
import {
  initActivities,
} from './db_utils/events';
import {
  dbNotificationsGetAllByIdOrderByTs,
} from './db_utils/notifications';

const initGetData = valLocals('initGetData', {
  user_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
  } = res.locals;
  const promiseArrayQ = [
    initMe(user_id),
    servicesGetAll(),
    initActivities(user_id),
    dbNotificationsGetAllByIdOrderByTs({ user_id }),
  ];

  Promise.all(promiseArrayQ)
    .then((data) => {
      const self = data[0];
      let users = [];
      let goals = [];
      let milestones = [];
      let ways = [];
      let notes = [];

      if (self.organizations.length > 0) {
        users = self.organizations[0].users;

        // We don't want duplication of that data served on the client;
        delete self.organizations[0].users;
      }

      if (self.goals.length > 0) {
        goals = self.goals;

        // We don't want duplication of that data served on the client;
        delete self.goals;
      }

      if (self.milestones.length > 0) {
        milestones = self.milestones;

        // We don't want duplication of that data served on the client;
        delete self.milestones;
      }

      if (self.ways.length > 0) {
        ways = self.ways;

        // We don't want duplication of that data served on the client;
        delete self.ways;
      }

      if (self.notes.length > 0) {
        notes = self.notes;

        // We don't want duplication of that data served on the client;
        delete self.notes;
      }

      const origin = config.get('origin');
      const ws_origin = origin.replace(/http(s)?/, 'ws$1');
      const port = config.get('clientPort');
      const api_port = config.get('apiPort');
      const https = port === '443';
      const url = https ? origin : `${origin}:${port}`;
      const ws_path = '/ws';
      const ws_url = https ? ws_origin + ws_path : `${ws_origin}:${api_port}${ws_path}`;

      setLocals({
        url,
        ws_url,
        self,
        users,
        goals,
        milestones,
        ways,
        notes,
        services: data[1],
        activity: data[2],
        notifications: data[3],
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});

export default initGetData;
