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
}, (req, res, next, setLocals) => {
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
    archived: false,
  };

  setLocals({
    milestone,
  });

  return next();
});
const milestonesInsert = valLocals('milestonesInsert', {
  milestone: object.require(),
}, (req, res, next, setLocals) => {
  const {
    milestone,
  } = res.locals;

  dbMilestonesInsertSingle({ milestone })
    .then((obj) => {
      setLocals({
        eventType: 'milestone_created',
        milestone: {
          id: milestone.id,
          title: milestone.title,
        },
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const milestonesArchive = valLocals('milestonesArchive', {
  id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    id,
  } = res.locals;
  const properties = {
    archived: true,
    updated_at: r.now(),
  };

  dbMilestonesUpdateSingle({ id, properties })
    .then(() => {
      setLocals({
        eventType: 'milestone_archived',
        id,
      });

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
}, (req, res, next, setLocals) => {
  const {
    user_id,
    milestone,
    eventType,
  } = res.locals;
  const milestone_id = milestone.id;
  const queueMessage = {
    user_id,
    milestone_id,
    event_type: eventType,
  };

  setLocals({
    queueMessage,
    messageGroupId: milestone_id,
  });

  return next();
});
const milestonesArchiveQueueMessage = valLocals('milestonesArchiveQueueMessage', {
  user_id: string.require(),
  id: string.require(),
  eventType: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    id,
    eventType,
  } = res.locals;
  const queueMessage = {
    user_id,
    milestone_id: id,
    event_type: eventType,
  };

  setLocals({
    queueMessage,
    messageGroupId: id,
  });

  return next();
});

export {
  milestonesCreate,
  milestonesInsert,
  milestonesArchive,
  milestonesCreateQueueMessage,
  milestonesArchiveQueueMessage,
};
