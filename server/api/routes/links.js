import express from 'express';
import {
  validateLinkAdd,
  validateLinkGet,
} from '../validators/links';
import {
  linksFindPermissions,
  linksAddPermission,
  linksGetByIds,
  linksCreate,
} from './middlewares/links';
import {
  sendResponse,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/link.get',
  validateLinkGet,
  linksGetByIds,
  sendResponse,
);

authed.all('/link.copy',
  validateLinkAdd,
  linksFindPermissions,
  linksAddPermission,
  sendResponse,
);

authed.all('/link.create',
  validateLinkAdd,
  linksCreate,
  linksAddPermission,
  sendResponse,
);

export {
  authed,
  notAuthed,
};
