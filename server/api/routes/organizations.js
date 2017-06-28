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
} from './middlewares/organizations';
import {
  usersGetByEmailWithFields,
  usersComparePasswordSignIn,
  usersParseInvitationToken,
  usersGetOwnerByIdWithFields,
} from './middlewares/users';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  valBody,
  valResponseAndSend,
  mapLocals,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();
const createOrganizationWithOnlyChangedFields = (locals) => {
  const updatedFields = locals.updatedFields;
  const organization = locals.organization;
  const pluckedOrganization = {
    id: organization.id,
    updated_at: organization.updated_at,
  };

  updatedFields.forEach((field) => {
    pluckedOrganization[field] = organization[field];
  });

  return pluckedOrganization;
};

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
    organization: createOrganizationWithOnlyChangedFields(locals),
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
    organization: createOrganizationWithOnlyChangedFields(locals),
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
    organization: createOrganizationWithOnlyChangedFields(locals),
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
  organizationsCheckAdminRights,
  organizationsDisableUser,
  mapLocals(locals => ({
    organization: createOrganizationWithOnlyChangedFields(locals),
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
  organizationsCheckAdminRights,
  organizationsEnableUser,
  mapLocals(locals => ({
    organization: createOrganizationWithOnlyChangedFields(locals),
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
  mapLocals(() => ({
    fields: ['email'],
  })),
  mapLocals(locals => ({
    owner_id: locals.organization.owner_id,
  })),
  usersGetOwnerByIdWithFields,
  organizationsCreateStripeCustomer,
  mapLocals(locals => ({
    organization: createOrganizationWithOnlyChangedFields(locals),
  })),
  organizationsUpdatedQueueMessage,
  notificationsPushToQueue,
  mapLocals(locals => ({
    stripe_customer_id: locals.stripeCustomerId,
  })),
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
