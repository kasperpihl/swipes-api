import express from 'express';
import {
  string,
  bool,
  object,
  array,
} from 'valjs';
import initGetData from './middlewares/init';
import {
  valBody,
  valResponseAndSend,
  mapLocals,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/init',
  valBody({
    timestamp: string.format('iso8601'),
    without_notes: bool,
  }),
  mapLocals(l => ({
    full_fetch: !l.timestamp,
    timestamp: l.timestamp === null ? new Date(1970, 1, 1).toISOString() : l.timestamp,
  })),
  initGetData,
  valResponseAndSend({
    me: object.require(),
    timestamp: string.format('iso8601').require(),
    users: array.of(object).require(),
    goals: array.of(object).require(),
    milestones: array.of(object).require(),
    ways: array.of(object).require(),
    notes: array.of(object).require(),
    services: array.of(object).require(),
    notifications: array.of(object).require(),
    onboarding: array.of(object).require(),
    full_fetch: bool.require(),
  }));

export {
  notAuthed,
  authed,
};
