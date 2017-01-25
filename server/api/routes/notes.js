import express from 'express';
import {
  string,
  bool,
} from 'valjs';
import {
  notesSave,
  notesCreate,
} from './middlewares/notes';
import {
  valBody,
  sendResponse,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/notes.create',
  valBody({
    title: string.require(),
    organization_id: string.require(),
    unlock: bool,
  }),
  notesCreate,
  sendResponse,
);

authed.all('/notes.save',
  valBody({
    id: string.require(),
    title: string.require(),
    organization_id: string.require(),
    text: string.require(),
    unlock: bool,
  }),
  notesSave,
  sendResponse,
);

export {
  authed,
  notAuthed,
};
