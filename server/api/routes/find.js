import express from 'express';
import {
  string,
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
    service_name: string.require(),
    type: string.require(),
    id: string.require(),
    account_id: string.require(),
  }),
  serviceWithAuthGet,
  serviceImport,
  servicePreviewFind,
  sendResponse,
);

export {
  authed,
  notAuthed,
};
