import r from 'rethinkdb';
import {
  string,
  bool,
  object,
} from 'valjs';
import {
  dbNotesInsert,
} from './db_utils/notes';
import {
  generateSlackLikeId,
  valLocals,
} from '../../utils';

const notesCreate = valLocals('notesCreate', {
  user_id: string.require(),
  organization_id: string.require(),
  title: string.require(),
}, (req, res, next) => {
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
});
const notesSave = valLocals('notesSave', {
  user_id: string.require(),
  organization_id: string.require(),
  id: string.require(),
  text: object.require(),
  unlock: bool,
}, (req, res, next) => {
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
});

export {
  notesCreate,
  notesSave,
};
