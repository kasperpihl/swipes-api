import express from 'express';
import {
  string,
  bool,
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
    title: string.require(),
    organization_id: string.require(),
    unlock: bool,
  }),
  notesCreate,
  valResponseAndSend({
    id: string.require(),
  }));

authed.all('/notes.save',
  valBody({
    id: string.require(),
    title: string,
    organization_id: string.require(),
    text: object.require(),
    unlock: bool,
  }),
  notesSave,
  valResponseAndSend(),
);

export {
  authed,
  notAuthed,
};
