import * as init from './init';
import * as users from './users';
import * as links from './links';
import * as services from './services';
import * as goals from './goals';
import * as steps from './steps';
import * as attachments from './attachments';
import * as search from './search';
// import * as webhooks from './webhooks';
import * as notifications from './notifications';
import * as notes from './notes';
import * as find from './find';
import * as milestones from './milestones';
import * as ways from './ways';
import * as stream from './stream';
import * as tokens from './tokens';

const v1NotAuthed = [
  users.notAuthed,
  services.notAuthed,
  stream.notAuthed,
];
const v1Authed = [
  init.authed,
  links.authed,
  services.authed,
  search.authed,
  users.authed,
  goals.authed,
  steps.authed,
  attachments.authed,
  notifications.authed,
  notes.authed,
  find.authed,
  milestones.authed,
  ways.authed,
  tokens.authed,
];
// const webhooksNotAuthed = [
//   webhooks.notAuthed,
// ];

export {
  v1NotAuthed,
  v1Authed,
  // webhooksNotAuthed,
};
