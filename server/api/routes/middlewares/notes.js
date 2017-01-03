import r from 'rethinkdb';
import {
  dbNotesInsert,
} from './db_utils/notes';
import {
  generateSlackLikeId,
} from '../../utils';

const notesCreate = (req, res, next) => {
  const {
    user_id,
    organization_id,
    title,
  } = res.locals;
  const note_id = generateSlackLikeId('N');
  const note = {
    user_id,
    organization_id,
    locked_by: null,
    id: note_id,
    ts: r.now(),
    title,
    created_at: r.now(),
    created_by: user_id,
  };

  dbNotesInsert({ note })
  .then(() => {
    res.locals.id = note_id;
    return next();
  })
  .catch((err) => {
    return next(err);
  });
};
const notesSave = (req, res, next) => {
  const {
    user_id,
    organization_id,
    id,
    text,
    unlock,
  } = res.locals;

  const locked_by = unlock ? null : user_id;

  const note = {
    user_id,
    organization_id,
    id,
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
  notesCreate,
  notesSave,
};
