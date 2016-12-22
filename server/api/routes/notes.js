import express from 'express';
import {
  validateNotesCreate,
  validateNotesSave,
} from '../validators/notes';
import {
  notesSave,
  notesCreate,
} from './middlewares/notes';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/notes.create',
  validateNotesCreate,
  notesCreate,
  (req, res) => {
    const {
      id,
    } = res.locals;
    return res.status(200).json({ ok: true, id });
  },
);


authed.all('/notes.save',
  validateNotesSave,
  notesSave,
  (req, res) => {
    return res.status(200).json({ ok: true });
  },
);

export {
  authed,
  notAuthed,
};
