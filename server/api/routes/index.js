"use strict";

import * as init from './init';
import * as users from './users';
import * as links from './links';
import * as services from './services';
import * as webhooks from './webhooks';

const v1NotAuthed = [
  users.notAuthed,
  services.notAuthed
]

const v1Authed = [
  init.authed,
  links.authed,
  services.authed
]

const webhooksNotAuthed = [
  webhooks.notAuthed
]

export {
  v1NotAuthed,
  v1Authed,
  webhooksNotAuthed
}
