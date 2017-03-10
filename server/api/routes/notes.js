import express from 'express';
import {
  string,
  number,
  object,
} from 'valjs';
import {
  notesSave,
  notesCreate,
} from './middlewares/notes';
import {
  valBody,
  valResponseAndSend,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/notes.create',
  valBody({
    organization_id: string.require(),
    text: object.require(),
  }),
  notesCreate,
  valResponseAndSend({
    note: object.require(),
  }));

authed.all('/notes.save',
  valBody({
    id: string.require(),
    title: string,
    organization_id: string.require(),
    save_id: string.require(),
    rev: number.require(),
    text: object.require(),
  }),
  notesSave,
  valResponseAndSend({
    note: object.require(),
  }),
);

export {
  authed,
  notAuthed,
};
