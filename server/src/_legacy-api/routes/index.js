import * as users from './users';
import * as links from './links';
import * as services from './services';
import * as files from './files';
import * as notes from './notes';
import * as me from './me';
import * as organizations from './organizations';

const v1NotAuthed = [
  users.notAuthed,
  services.notAuthed,
  organizations.notAuthed,
  me.notAuthed
];
const v1Authed = [
  links.authed,
  services.authed,
  users.authed,
  files.authed,
  notes.authed,
  me.authed,
  organizations.authed
];
const v1Multipart = [me.multipart];

export { v1NotAuthed, v1Authed, v1Multipart };
