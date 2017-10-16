import express from 'express';
import {
  string,
  bool,
  object,
  array,
} from 'valjs';
import {
  init,
  initWithoutOrganization,
} from './middlewares/init';
import {
  valBody,
  valResponseAndSend,
  mapLocals,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all(
  '/init',
  valBody({
    organization_id: string,
    timestamp: string.format('iso8601'),
    without_notes: bool,
  }),
  mapLocals(l => ({
    full_fetch: !l.timestamp,
    timestamp: l.timestamp === null ? new Date(1970, 1, 1).toISOString() : l.timestamp,
  })),
  initWithoutOrganization,
  init,
  valResponseAndSend({
    me: object.require(),
    timestamp: string.format('iso8601').require(),
    full_fetch: bool.require(),
    sofi: object.require(),
    users: array.of(object),
    goals: array.of(object),
    milestones: array.of(object),
    ways: array.of(object),
    notes: array.of(object),
    posts: array.of(object),
    services: array.of(object),
    notifications: array.of(object),
    onboarding: array.of(object),
    pending_organizations: array.of(object),
  }),
);

export {
  notAuthed,
  authed,
};
