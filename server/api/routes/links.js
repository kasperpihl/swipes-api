import express from 'express';
import {
  preValidateLinkAdd,
  validateLinkAdd,
} from '../validators/links';
import {
  linksFindPermissions,
  linksAddPermission,
  linksCreateMapLocals,
  linksCreate,
} from './middlewares/links';
import {
  serviceWithAuthGet,
  serviceImport,
  serviceDoShareRequest,
} from './middlewares/services';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/link.addPermission',
  preValidateLinkAdd,
  validateLinkAdd,
  linksFindPermissions,
  linksAddPermission,
  (req, res) => {
    const {
      meta,
      short_url,
    } = res.locals;

    res.status(200).json({ ok: true, short_url, meta });
  });

authed.all('/link.create',
  preValidateLinkAdd,
  validateLinkAdd,
  linksCreateMapLocals,
  serviceWithAuthGet,
  serviceImport,
  serviceDoShareRequest,
  linksCreate,
  linksAddPermission,
  (req, res) => {
    const {
      meta,
      short_url,
    } = res.locals;

    res.status(200).json({ ok: true, short_url, meta });
  });

export {
  authed,
  notAuthed,
};
