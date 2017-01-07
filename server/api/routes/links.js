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

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/link.get',
  validateLinkGet,
  linksGetByIds,
  (req, res) => {
    const {
      mappedLinks,
    } = res.locals;

    res.status(200).json({ ok: true, links: mappedLinks });
  },
);

authed.all('/link.copy',
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
