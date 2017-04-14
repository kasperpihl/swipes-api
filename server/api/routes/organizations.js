import express from 'express';
import {
  string,
  array,
  object,
  date,
} from 'valjs';
import {
  organizationsCreate,
  organizationsAddToUser,
  organizationsGetInfoFromInvitationToken,
  organizationsGetSingle,
  organizationsCheckAdminRights,
  organizationsPromoteToAdmin,
  organizationsDemoteAnAdmin,
  organizationsUpdatedQueueMessage,
} from './middlewares/organizations';
import {
  usersParseInvitationToken,
} from './middlewares/users';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
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

authed.all('/organizations.promoteToAdmin',
  valBody({
    user_to_promote_id: string.require(),
    organization_id: string.require(),
  }),
  organizationsGetSingle,
  organizationsCheckAdminRights,
  organizationsPromoteToAdmin,
  organizationsUpdatedQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    organization_id: string.require(),
    admins: array.require(),
    updated_at: date.require(),
  }),
);
authed.all('/organizations.demoteAnAdmin',
  valBody({
    user_to_demote_id: string.require(),
    organization_id: string.require(),
  }),
  organizationsGetSingle,
  organizationsCheckAdminRights,
  organizationsDemoteAnAdmin,
  organizationsUpdatedQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    organization_id: string.require(),
    admins: array.require(),
    updated_at: date.require(),
  }),
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
