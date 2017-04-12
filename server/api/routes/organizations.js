import express from 'express';
import {
  string,
  array,
  object,
} from 'valjs';
import {
  organizationsCreate,
  organizationsAddToUser,
  organizationsGetInfoFromInvitationToken,
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

notAuthed.all('/organizations.getInfoFromInvitationToken',
  valBody({
    invitation_token: string.require(),
  }),
  usersParseInvitationToken,
  organizationsGetInfoFromInvitationToken,
  valResponseAndSend({
    me: object.require(),
    organization: object.require(),
    users: array.require(),
  }),
);

export {
  authed,
  notAuthed,
};
