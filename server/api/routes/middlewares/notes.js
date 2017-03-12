import r from 'rethinkdb';
import {
  string,
  number,
  object,
} from 'valjs';
import {
  SwipesError,
} from '../../../middlewares/swipes-error';
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
  text: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization_id,
    text,
  } = res.locals;
  const note_id = generateSlackLikeId('N');
  const note = {
    organization_id,
    rev: 1,
    id: note_id,
    text,
    created_at: r.now(),
    updated_at: r.now(),
    updated_by: user_id,
    created_by: user_id,
  };

  dbNotesInsert({ note })
  .then(() => {
    setLocals({
      note,
    });
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
  save_id: string.require(),
  rev: number.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization_id,
    id,
    text,
    save_id,
    rev,
  } = res.locals;

  const note = {
    updated_by: user_id,
    organization_id,
    id,
    text,
    last_save_id: save_id,
    updated_at: r.now(),
    rev,
  };

  dbNotesInsert({ note })
  .then((res) => {
    if (res.unchanged === 1) {
      return next(new SwipesError({
        message: 'merged_needed',
        note: res.changes[0].old_val,
      }));
    }
    setLocals({
      note: res.changes[0].new_val,
    });

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
