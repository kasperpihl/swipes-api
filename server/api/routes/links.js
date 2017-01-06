import express from 'express';
import {
  preValidateLinkAdd,
  validateLinkAdd,
} from '../validators/links';
import {
  linksFindPermissions,
  linksAddPermission,
  linksCreate,
} from './middlewares/links';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/link.copy',
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
  linksCreate,
  linksAddPermission,
  (req, res) => {
    const {
      short_url,
    } = res.locals;

    res.status(200).json({ ok: true, short_url });
  });

export {
  authed,
  notAuthed,
};
