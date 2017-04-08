import express from 'express';
import {
  string,
  object,
  array,
} from 'valjs';
import initGetData from './middlewares/init';
import {
  valResponseAndSend,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/init',
  initGetData,
  valResponseAndSend({
    me: object.require(),
    ts: string.format('iso8601').require(),
    users: array.of(object).require(),
    goals: array.of(object).require(),
    milestones: array.of(object).require(),
    ways: array.of(object).require(),
    notes: array.of(object).require(),
    services: array.of(object).require(),
    notifications: array.of(object).require(),
    onboarding: array.of(object).require(),
  }));

export {
  notAuthed,
  authed,
};
