import express from 'express';
import {
  string,
  object,
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
  organizationsCheckOwnerRights,
  organizationsTransferOwnership,
  organizationsDisableUser,
  organizationsEnableUser,
  organizationsCreateStripeCustomer,
  organizationsCheckOwnerDisabledUser,
  organizationsCheckIsDisableValid,
  organizationsCheckIsEnableValid,
  organizationsCreateSubscriptionCustomer,
  organizationsUpdateSubscriptionCustomer,
} from './middlewares/organizations';
import {
  usersGetByEmailWithFields,
  usersComparePasswordSignIn,
  usersParseInvitationToken,
  usersGetByIdWithFields,
} from './middlewares/users';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  organizationConcatUsers,
} from './middlewares/utils';
import {
  valBody,
  valResponseAndSend,
  mapLocals,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/organizations.create',
  valBody({
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
  mapLocals(locals => ({
    organization: organizationConcatUsers(locals),
  })),
  organizationsUpdatedQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    organization: object.require(),
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
  mapLocals(locals => ({
    organization: organizationConcatUsers(locals),
  })),
  organizationsUpdatedQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    organization: object.require(),
  }),
);

authed.all('/organizations.transferOwnership',
  valBody({
    user_to_transfer_id: string.require(),
    organization_id: string.require(),
    password: string.min(1).require(),
  }),
  mapLocals(() => ({
    fields: ['id', 'password'],
    passwordError: 'Invalid password',
  })),
  usersGetByEmailWithFields,
  usersComparePasswordSignIn,
  organizationsGetSingle,
  organizationsCheckOwnerRights,
  organizationsTransferOwnership,
  mapLocals(locals => ({
    organization: organizationConcatUsers(locals),
  })),
  organizationsUpdatedQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    organization: object.require(),
  }),
);

authed.all('/organizations.disableUser',
  valBody({
    user_to_disable_id: string.require(),
    organization_id: string.require(),
  }),
  organizationsGetSingle,
  mapLocals(locals => ({
    fields: ['organizations'],
    userToGetId: locals.user_to_disable_id,
  })),
  usersGetByIdWithFields,
  organizationsCheckIsDisableValid,
  organizationsCheckOwnerDisabledUser,
  organizationsCheckAdminRights,
  organizationsDisableUser,
  organizationsUpdateSubscriptionCustomer,
  mapLocals(locals => ({
    organization: organizationConcatUsers(locals),
  })),
  organizationsUpdatedQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    organization: object.require(),
  }),
);
authed.all('/organizations.enableUser',
  valBody({
    user_to_enable_id: string.require(),
    organization_id: string.require(),
  }),
  organizationsGetSingle,
  mapLocals(locals => ({
    fields: ['organizations'],
    userToGetId: locals.user_to_enable_id,
  })),
  usersGetByIdWithFields,
  organizationsCheckIsEnableValid,
  organizationsCheckAdminRights,
  organizationsEnableUser,
  organizationsUpdateSubscriptionCustomer,
  mapLocals(locals => ({
    organization: organizationConcatUsers(locals),
  })),
  organizationsUpdatedQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    organization: object.require(),
  }),
);

authed.all('/organizations.createStripeCustomer',
  valBody({
    organization_id: string.require(),
    stripe_token: string.require(),
    plan: string.require(),
  }),
  organizationsGetSingle,
  organizationsCheckAdminRights,
  mapLocals(locals => ({
    fields: ['email'],
    userToGetId: locals.organization.owner_id,
  })),
  usersGetByIdWithFields,
  mapLocals(locals => ({
    ownerUser: locals.user,
  })),
  organizationsCreateStripeCustomer,
  organizationsCreateSubscriptionCustomer,
  mapLocals(locals => ({
    organization: organizationConcatUsers(locals),
  })),
  organizationsUpdatedQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    organization: object.require(),
  }),
);

notAuthed.all('/organizations.getInfoFromInvitationToken',
  valBody({
    invitation_token: string.require(),
  }),
  usersParseInvitationToken,
  organizationsGetInfoFromInvitationToken,
  valResponseAndSend({
    me: object,
    download_links: object.require(),
    organization: object,
    invited_by: object,
  }),
);

export {
  authed,
  notAuthed,
};
