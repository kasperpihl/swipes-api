import * as users from './users';
import * as links from './links';
import * as services from './services';
import * as goals from './goals';
import * as steps from './steps';
import * as attachments from './attachments';
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
import * as exporter from './export_plans_csv';

const v1NotAuthed = [
  users.notAuthed,
  services.notAuthed,
  stream.notAuthed,
  organizations.notAuthed,
  dashboard.notAuthed,
  me.notAuthed,
];
const v1Authed = [
  links.authed,
  services.authed,
  users.authed,
  goals.authed,
  steps.authed,
  attachments.authed,
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
  exporter.authed,
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
