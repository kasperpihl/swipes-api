import express from 'express';
import {
  string,
  shape,
} from 'valjs';
import {
  valBody,
  valResponseAndSend,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/milestones.create',
  valBody({
    title: string.require(),
    organization_id: string.require(),
    description: string,
    due_date: string.format('iso8601'),
  }),
  valResponseAndSend({
    milestone: shape({
      id: string.require(),
      title: string.require(),
    }).require(),
  }));

export {
  authed,
  notAuthed,
};
