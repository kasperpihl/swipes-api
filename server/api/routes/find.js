import express from 'express';
import {
  string,
  object,
} from 'valjs';
import {
  valBody,
  valResponseAndSend,
} from '../utils';
import {
  serviceWithAuthGet,
  serviceImport,
  servicePreviewFind,
} from './middlewares/services';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/find.preview',
  valBody({
    service: object.as({
      id: string.require(),
      name: string.require(),
      type: string.require(),
    }).require(),
    permission: object.as({
      account_id: string.require(),
    }).require(),
  }),
  (req, res, next) => {
    const {
      service,
      permission,
    } = res.locals;

    res.locals.service_item_id = service.id;
    res.locals.service_name = service.name;
    res.locals.service_type = service.type;
    res.locals.account_id = permission.account_id;

    return next();
  },
  serviceWithAuthGet,
  serviceImport,
  servicePreviewFind,
  valResponseAndSend({
    preview: object.require(),
  }));

export {
  authed,
  notAuthed,
};
