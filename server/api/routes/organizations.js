import express from 'express';
import {
  string,
  array,
} from 'valjs';
import {
  organizationsCreate,
  organizationsAddToUser,
  organizationsGetAllUsers,
} from './middlewares/organizations';
import {
  usersParseInvitationToken,
} from './middlewares/users';
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

notAuthed.all('/organizations.getUsersFromInvitationToken',
  valBody({
    invitation_token: string.require(),
  }),
  usersParseInvitationToken,
  organizationsGetAllUsers,
  valResponseAndSend({
    users: array.require(),
  }),
);

export {
  authed,
  notAuthed,
};
