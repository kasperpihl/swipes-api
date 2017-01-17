import express from 'express';
import {
  string,
} from 'valjs';
import {
  valBody,
  sendResponse,
} from '../utils';
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
  serviceWithAuthFromLinkGet,
  serviceImport,
  servicePreview,
} from './middlewares/services';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/link.get',
  validateLinkGet,
  linksGetByIds,
  sendResponse,
);

// authed.all('/link.copy',
//   validateLinkAdd,
//   linksFindPermissions,
//   linksAddPermission,
//   sendResponse,
// );

authed.all('/link.create',
  validateLinkAdd,
  linksCreate,
  linksAddPermission,
  sendResponse,
);

authed.all('/link.preview',
  valBody({
    short_url: string.require(),
  }),
  linksFindPermissions,
  serviceWithAuthFromLinkGet,
  serviceImport,
  servicePreview,
  sendResponse,
);

export {
  authed,
  notAuthed,
};
