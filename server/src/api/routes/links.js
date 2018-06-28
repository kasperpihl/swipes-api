import express from 'express';
import {
  string,
  object,
  array,
} from 'valjs';
import {
  valBody,
  valResponseAndSend,
  mapLocals,
} from '../utils';
import {
  linksCreate,
  linksAddPermission,
  linksFindPermissions,
  linksGetByIds,
} from './middlewares/links';
import {
  serviceWithAuthFromLinkGet,
  serviceImport,
  servicePreview,
} from './middlewares/services';
import {
  service,
  linkPermission,
  linkMeta,
} from '../validators';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/links.get',
  valBody({
    ids: array.of(string).require(),
  }),
  linksGetByIds,
  valResponseAndSend({
    links: array.of(object).require(),
  }));

authed.all('/links.preview',
  valBody({
    short_url: string.require(),
  }),
  linksFindPermissions,
  serviceWithAuthFromLinkGet,
  serviceImport,
  servicePreview,
  valResponseAndSend({
    preview: object.require(),
  }));

authed.all('/links.create',
  valBody({
    link: object.as({
      service,
      permission: linkPermission,
      meta: linkMeta,
    }).require(),
  }),
  linksCreate,
  linksAddPermission,
  mapLocals((locals) => {
    const {
      link,
      short_url,
    } = locals;

    link.permission = {
      short_url,
    };

    return { link };
  }),
  valResponseAndSend({
    link: object.require(),
  }));

export {
  authed,
  notAuthed,
};
