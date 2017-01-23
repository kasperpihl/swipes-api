import express from 'express';
import {
  string,
  object,
  array,
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

authed.all('/links.get',
  valBody({
    ids: array.of(string).require(),
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

authed.all('/links.create',
  valBody({
    service: object.as({
      id: string.require(),
      type: string.require(),
      name: string.require(),
    }).require(),
    permission: object.as({
      account_id: string.require(),
    }).require(),
    meta: object.as({
      title: string.require(),
    }).require(),
  }),
  linksCreate,
  linksAddPermission,
  sendResponse,
);

authed.all('/links.preview',
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
