import r from 'rethinkdb';
import {
  string,
  number,
  object,
  array,
  any,
} from 'valjs';
import SwipesError from 'src/utils/SwipesError';
import {
  dbNotesInsertWithConflictHandling,
  dbNotesGetSingle,
  dbNotesGetMultiple,
  dbNotesInsertBatch,
} from './db_utils/notes';
import {
  generateSlackLikeId,
  valLocals,
} from '../../utils';

const notesCreate = valLocals('notesCreate', {
  user_id: string.require(),
  organization_id: string.require(),
  text: any.of(object, array).require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization_id,
    text,
  } = res.locals;
  let texts = text;

  if (!Array.isArray(text)) {
    texts = [text];
  }

  const notes = [];

  texts.forEach((text) => {
    const note_id = generateSlackLikeId('N');
    const note = {
      organization_id,
      rev: 1,
      id: note_id,
      text,
      created_at: new Date(),
      updated_at: new Date(),
      updated_by: user_id,
      created_by: user_id,
    };

    notes.push(note);
  });

  dbNotesInsertBatch({ notes })
  .then(() => {
    setLocals({
      notes,
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
  note_id: string.require(),
  text: object.require(),
  save_id: string.require(),
  rev: number.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization_id,
    note_id,
    text,
    save_id,
    rev,
  } = res.locals;

  const note = {
    updated_by: user_id,
    organization_id,
    text,
    id: note_id,
    last_save_id: save_id,
    updated_at: r.now(),
    rev,
  };

  dbNotesInsertWithConflictHandling({ note })
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
const notesGetSingle = valLocals('notesGetSingle', {
  note_id: string.require(),
  organization_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    note_id,
    organization_id,
  } = res.locals;

  dbNotesGetSingle({ note_id, organization_id })
  .then((notes) => {
    if (notes.length === 0) {
      return next(new SwipesError({
        message: 'Invalid note',
      }));
    }
    setLocals({
      note: notes[0],
    });

    return next();
  })
  .catch((err) => {
    return next(err);
  });
});
const notesGetMultipleFromGoal = valLocals('notesGetMultipleFromGoal', {
  goal: object.require(),
  organization_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    goal,
    organization_id,
  } = res.locals;
  const {
    attachment_order,
    attachments,
  } = goal;
  const note_ids = [];

  attachment_order.forEach((attachmentId) => {
    const attachment = attachments[attachmentId];
    if (attachment.link.service.type === 'note') {
      note_ids.push(attachment.link.service.id);
    }
  });

  if (note_ids.length === 0) {
    setLocals({
      notes: [],
    });

    return next();
  }

  return dbNotesGetMultiple({ note_ids, organization_id })
  .then((notes) => {
    if (notes.length === 0) {
      return next(new SwipesError({
        message: 'Invalid notes',
      }));
    }

    setLocals({
      notes,
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
  notesGetSingle,
  notesGetMultipleFromGoal,
};
