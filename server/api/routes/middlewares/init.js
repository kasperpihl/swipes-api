"use strict";

import Promise from 'bluebird';
import config from 'config';
import {
  initMe
} from './db_utils/me';
import {
  servicesGetAll
} from './db_utils/services';
import {
  initWorkflows
} from './db_utils/workflows';
import {
  initActivities
} from './db_utils/events';
import {
  processesGetAllOrderedByTitle
} from './db_utils/processes';

const initGetData = (req, res, next) => {
  const userId = req.userId;
  const promiseArrayQ = [
    initMe(userId),
    initWorkflows(userId),
    servicesGetAll(),
    initActivities(userId),
    processesGetAllOrderedByTitle()
  ]

  Promise.all(promiseArrayQ)
    .then((data) => {
      const self = data[0];
      let users = [];
      let goals = [];

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

      const response = {
        ok: true,
        url: config.get('clientPort') === '443' ?
            config.get('origin') :
            config.get('origin') + ':' + config.get('clientPort'),
        workflow_base_url: config.get('clientPort') === '443' ?
                          config.get('origin')  + '/workflows/' :
                          config.get('origin') + ':' + config.get('clientPort')  + '/workflows/',
        self,
        users,
        goals,
        workflows: data[1],
        services: data[2],
        activity: data[3],
        processes: data[4]
      }

      res.locals.initData = response;

      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

export {
  initGetData
}
