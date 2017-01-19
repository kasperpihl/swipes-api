import express from 'express';
import {
  string,
  shape,
} from 'valjs';
import {
  valBody,
  sendResponse,
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
    service: shape({
      id: string.require(),
      name: string.require(),
      type: string.require(),
    }).require(),
    permission: shape({
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
  sendResponse,
);

export {
  authed,
  notAuthed,
};
