import express from 'express';
import {
  object,
} from 'valjs';
import {
  valBody,
  valResponseAndSend,
} from '../utils';
import {
  service,
  linkPermission,
} from '../validators';
import {
  serviceWithAuthGet,
  serviceImport,
  servicePreviewFind,
} from './middlewares/services';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/find.preview',
  valBody({
    service,
    permission: linkPermission,
  }),
  (req, res, next, setLocals) => {
    const {
      service,
      permission,
    } = res.locals;

    setLocals({
      service_item_id: service.id,
      service_name: service.name,
      service_type: service.type,
      account_id: permission.account_id,
    });

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
