"use strict";

import r from 'rethinkdb';
import db from '../db.js';

const notifyAllInGoal = (req, res, next) => {
  const {
    goal
  } = res.locals;

  const assignees = [];
  const steps = goal.steps;

  steps.forEach((step) => {
    step.assignees.forEach((assignee) => {
      assignees.push(assignee);
    })
  })

  const uniqueUsersToNotify = Array.from(new Set(assignees));

  res.locals.uniqueUsersToNotify = uniqueUsersToNotify;

  return next();
}

const notifyAllInCompany = (req, res, next) => {
  const {
    user
  } = res.locals;

  const usersIds = [];
  const organizations = user.organizations;

  organizations.forEach((organization) => {
    organization.users.forEach((userId) => {
      usersIds.push(userId);
    })
  })

  const uniqueUsersToNotify = Array.from(new Set(usersIds));

  res.locals.uniqueUsersToNotify = uniqueUsersToNotify;

  return next();
}

const notifyCommonRethinkdb = (req, res, next) => {
  const {
    uniqueUsersToNotify,
    eventType,
    eventMessage,
    eventData
  } = res.locals;

  const date = new Date();
  const type = eventType;
  const message = eventMessage;

  const objToInsert = {
    user_ids: uniqueUsersToNotify,
    date,
    type,
    message,
    data: eventData
  };

  console.log(objToInsert);

  const query = r.table('events_multiple').insert(objToInsert);

  db.rethinkQuery(query)
    .then(() => {
      return next();
    })
    .catch((err) => {
      console.log(err);
      return next(err);
    });
}

export {
  notifyAllInGoal,
  notifyAllInCompany,
  notifyCommonRethinkdb
}
