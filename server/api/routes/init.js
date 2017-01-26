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

// !T_TODO Change rtm.start to init before shipping the new server
authed.all('/rtm.start',
  initGetData,
  valResponseAndSend({
    url: string.require(),
    ws_url: string.require(),
    self: object.require(),
    users: array.of(object).require(),
    goals: array.of(object).require(),
    milestones: array.of(object).require(),
    ways: array.of(object).require(),
    notes: array.of(object).require(),
    services: array.of(object).require(),
    activity: array.of(object).require(),
    notifications: array.of(object).require(),
  }));

export {
  notAuthed,
  authed,
};
