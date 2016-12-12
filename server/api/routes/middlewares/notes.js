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
  } = res.locals;

  const note = {
    organization_id,
    goal_id,
    text,
    ts: r.now(),
    locked_by: user_id,
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
