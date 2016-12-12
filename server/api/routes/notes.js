import express from 'express';
import {
  validateNotesSave,
} from '../validators/notes';
import {
  notesSave,
} from './middlewares/notes';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/notes.save',
  validateNotesSave,
  notesSave,
  (req, res) => {
    return res.status(200).json({ ok: true });
  });

export {
  authed,
  notAuthed,
};
