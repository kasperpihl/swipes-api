import r from 'rethinkdb';
import {
  string,
  object,
} from 'valjs';
import {
  dbWaysInsertSingle,
  dbWaysUpdateSingle,
} from './db_utils/ways';
import {
  generateSlackLikeId,
  valLocals,
} from '../../utils';

const waysCreate = valLocals('waysCreate', {
  user_id: string.require(),
  title: string.require(),
  organization_id: string.require(),
  description: string,
  goal: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    title,
    organization_id,
    description,
    goal,
  } = res.locals;
  const way = {
    title,
    goal,
    organization_id,
    id: generateSlackLikeId('W'),
    description: description || '',
    created_by: user_id,
    created_at: r.now(),
    updated_at: r.now(),
    archived: false,
  };

  setLocals({
    way,
  });

  return next();
});
const waysInsert = valLocals('waysInsert', {
  way: object.require(),
}, (req, res, next, setLocals) => {
  const {
    way,
  } = res.locals;

  dbWaysInsertSingle({ way })
    .then((obj) => {
      setLocals({
        eventType: 'way_created',
        way,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const waysArchive = valLocals('waysArchive', {
  id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    id,
  } = res.locals;
  const properties = {
    archived: true,
    updated_at: r.now(),
  };

  dbWaysUpdateSingle({ id, properties })
    .then(() => {
      setLocals({
        eventType: 'way_archived',
        id,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const waysCreateQueueMessage = valLocals('waysCreateQueueMessage', {
  user_id: string.require(),
  way: object.require(),
  eventType: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    way,
    eventType,
  } = res.locals;
  const way_id = way.id;
  const queueMessage = {
    user_id,
    way_id,
    event_type: eventType,
  };

  setLocals({
    queueMessage,
    messageGroupId: way_id,
  });

  return next();
});
const waysArchiveQueueMessage = valLocals('waysArchiveQueueMessage', {
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
    way_id: id,
    event_type: eventType,
  };

  setLocals({
    queueMessage,
    messageGroupId: id,
  });

  return next();
});

export {
  waysCreate,
  waysInsert,
  waysArchive,
  waysCreateQueueMessage,
  waysArchiveQueueMessage,
};
