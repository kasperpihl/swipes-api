import express from 'express';
import {
  string,
} from 'valjs';
import {
  organizationsCreate,
  organizationsAddToUser,
} from './middlewares/organizations';
import {
  valBody,
  valResponseAndSend,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/organizations.create',
  valBody({
    user_id: string.require(),
    organization_name: string.require(),
  }),
  organizationsCreate,
  organizationsAddToUser,
  valResponseAndSend(),
);

export {
  authed,
  notAuthed,
};
