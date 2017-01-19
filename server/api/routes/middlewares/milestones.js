import r from 'rethinkdb';
import {
  string,
  object,
} from 'valjs';
import {
  dbMilestonesInsertSingle,
  dbMilestonesUpdateSingle,
} from './db_utils/milestones';
import {
  generateSlackLikeId,
  valLocals,
} from '../../utils';

const milestonesCreate = valLocals('milestonesCreate', {
  user_id: string.require(),
  title: string.require(),
  organization_id: string.require(),
  description: string,
  due_date: string.format('iso8601'),
}, (req, res, next) => {
  const {
    user_id,
    title,
    organization_id,
    description,
    due_date,
  } = res.locals;
  const milestone = {
    id: generateSlackLikeId('M'),
    title,
    organization_id,
    description: description || '',
    due_date: due_date || null,
    created_by: user_id,
    created_at: r.now(),
    updated_at: r.now(),
    deleted: false,
  };

  res.locals.milestone = milestone;

  return next();
});
const milestonesInsert = valLocals('milestonesInsert', {
  milestone: object.require(),
}, (req, res, next) => {
  const {
    milestone,
  } = res.locals;

  dbMilestonesInsertSingle({ milestone })
    .then((obj) => {
      res.locals.eventType = 'milestone_created';
      res.locals.returnObj = {
        milestone: {
          id: milestone.id,
          title: milestone.title,
        },
      };

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const milestonesDelete = valLocals('milestonesDelete', {
  id: string.require(),
}, (req, res, next) => {
  const {
    id,
  } = res.locals;
  const properties = { deleted: true };

  dbMilestonesUpdateSingle({ id, properties })
    .then(() => {
      res.locals.eventType = 'milestone_archived';
      res.locals.returnObj = {
        id,
      };

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const milestonesCreateQueueMessage = valLocals('milestonesCreateQueueMessage', {
  user_id: string.require(),
  milestone: object.require(),
  eventType: string.require(),
}, (req, res, next) => {
  const {
    user_id,
    milestone,
    eventType,
  } = res.locals;

  const milestone_id = milestone.id;

  res.locals.queueMessage = {
    user_id,
    milestone_id,
    event_type: eventType,
  };
  res.locals.messageGroupId = milestone_id;

  return next();
});
const milestonesDeleteQueueMessage = valLocals('milestonesDeleteQueueMessage', {
  user_id: string.require(),
  id: string.require(),
  eventType: string.require(),
}, (req, res, next) => {
  const {
    user_id,
    id,
    eventType,
  } = res.locals;

  res.locals.queueMessage = {
    user_id,
    milestone_id: id,
    event_type: eventType,
  };
  res.locals.messageGroupId = id;

  return next();
});

export {
  milestonesCreate,
  milestonesInsert,
  milestonesDelete,
  milestonesCreateQueueMessage,
  milestonesDeleteQueueMessage,
};
