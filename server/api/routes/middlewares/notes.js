import r from 'rethinkdb';
import {
  dbNotesInsert,
} from './db_utils/notes';

const notesSave = (req, res, next) => {
  const {
    user_id,
    organization_id,
    goal_id,
    text,
    unlock,
  } = res.locals;

  const locked_by = unlock ? null : user_id;

  const note = {
    user_id,
    organization_id,
    goal_id,
    text,
    locked_by,
    ts: r.now(),
  };

  dbNotesInsert({ note })
  .then(() => {
    return next();
  })
  .catch((err) => {
    return next(err);
  });
};

export {
  notesSave,
};
