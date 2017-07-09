import * as init from './init';
import * as users from './users';
import * as links from './links';
import * as services from './services';
import * as goals from './goals';
import * as steps from './steps';
import * as attachments from './attachments';
import * as search from './search';
import * as files from './files';
// import * as webhooks from './webhooks';
import * as notifications from './notifications';
import * as notes from './notes';
import * as find from './find';
import * as milestones from './milestones';
import * as ways from './ways';
import * as stream from './stream';
import * as tokens from './tokens';
import * as me from './me';
import * as organizations from './organizations';
import * as dashboard from './dashboard';
import * as posts from './posts';

const v1NotAuthed = [
  users.notAuthed,
  services.notAuthed,
  stream.notAuthed,
  organizations.notAuthed,
  dashboard.notAuthed,
  me.notAuthed,
];
const v1Authed = [
  init.authed,
  links.authed,
  services.authed,
  users.authed,
  goals.authed,
  steps.authed,
  attachments.authed,
  search.authed,
  files.authed,
  notifications.authed,
  notes.authed,
  find.authed,
  milestones.authed,
  ways.authed,
  tokens.authed,
  me.authed,
  organizations.authed,
  posts.authed,
];
const v1Multipart = [
  me.multipart,
];
// const webhooksNotAuthed = [
//   webhooks.notAuthed,
// ];

export {
  v1NotAuthed,
  v1Authed,
  v1Multipart,
  // webhooksNotAuthed,
};
