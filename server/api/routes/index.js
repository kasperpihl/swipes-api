import * as init from './init';
import * as users from './users';
import * as links from './links';
import * as services from './services';
import * as goals from './goals';
import * as steps from './steps';
import * as search from './search';
import * as webhooks from './webhooks';
import * as notifications from './notifications';
import * as notes from './notes';
import * as find from './find';
import * as milestones from './milestones';

const v1NotAuthed = [
  users.notAuthed,
  services.notAuthed,
];
const v1Authed = [
  init.authed,
  links.authed,
  services.authed,
  search.authed,
  users.authed,
  goals.authed,
  steps.authed,
  notifications.authed,
  notes.authed,
  find.authed,
  milestones.authed,
];
const webhooksNotAuthed = [
  webhooks.notAuthed,
];

export {
  v1NotAuthed,
  v1Authed,
  webhooksNotAuthed,
};
