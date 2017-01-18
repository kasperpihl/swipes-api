import express from 'express';
import {
  string,
  shape,
  arrayOf,
} from 'valjs';
import {
  valBody,
  sendResponse,
} from '../utils';
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
  valBody({
    ids: arrayOf(string).require(),
  }),
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
  valBody({
    link: shape({
      id: string.require(),
      type: string.require(),
      service_name: string.require(),
    }).require(),
    permission: shape({
      account_id: string.require(),
    }).require(),
    meta: shape({
      title: string.require(),
    }).require(),
  }),
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
