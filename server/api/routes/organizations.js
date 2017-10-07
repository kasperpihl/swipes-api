import express from 'express';
import {
  string,
  object,
} from 'valjs';
import MiddlewareComposer from './middleware_composer';
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
  organizationsCancelSubscription,
  organizationsCreatedQueueMessage,
  organizationsActivateUser,
  organizationsCheckOwnerRightsNot,
} from './middlewares/organizations';
import {
  usersCheckIfInOrganization,
  usersGetByEmailWithFields,
  usersComparePasswordSignIn,
  usersParseInvitationToken,
  usersGetByIdWithFields,
  userActivatedUserSignUpQueueMessage,
  usersLeaveOrganizationQueueMessage,
  usersDisabledQueueMessage,
} from './middlewares/users';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  organizationConcatUsers,
} from './middlewares/utils';
import {
  onboardingGetMiddlewares,
} from './middlewares/onboarding';
import {
  valBody,
  valResponseAndSend,
  mapLocals,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all(
  '/organizations.create',
  valBody({
    organization_name: string.require(),
  }),
  mapLocals(locals => ({
    fields: ['organizations'],
    userToGetId: locals.user_id,
  })),
  usersGetByIdWithFields,
  usersCheckIfInOrganization,
  organizationsCreate,
  organizationsAddToUser,
  (originalReq, originalRes, originalNext) => {
    const composer = new MiddlewareComposer(
      originalRes.locals,
      ...onboardingGetMiddlewares,
      (req, res, next) => {
        return originalNext();
      },
      (err, req, res, next) => {
        return originalNext(err);
      },
    );

    return composer.run();
  },
  organizationsCreatedQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    organization: object.require(),
  }),
);

authed.all(
  '/organizations.join',
  valBody({
    organization_id: string.require(),
  }),
  mapLocals(locals => ({
    fields: ['organizations'],
    userToGetId: locals.user_id,
    user_to_activate_id: locals.user_id,
  })),
  usersGetByIdWithFields,
  usersCheckIfInOrganization,
  organizationsActivateUser,
  organizationsAddToUser,
  organizationsUpdateSubscriptionCustomer,
  userActivatedUserSignUpQueueMessage,
  notificationsPushToQueue,
  mapLocals(locals => ({
    organization: organizationConcatUsers(locals),
  })),
  organizationsUpdatedQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    organization: object.require(),
  }),
);

authed.all(
  '/organizations.leave',
  valBody({
    organization_id: string.require(),
  }),
  organizationsGetSingle,
  organizationsCheckOwnerRightsNot,
  mapLocals(locals => ({
    user_to_disable_id: locals.user_id,
  })),
  organizationsDisableUser,
  organizationsUpdateSubscriptionCustomer,
  mapLocals(locals => ({
    organization: organizationConcatUsers(locals),
  })),
  organizationsUpdatedQueueMessage,
  notificationsPushToQueue,
  usersLeaveOrganizationQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    organization: object.require(),
  }),
);

authed.all(
  '/organizations.promoteToAdmin',
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

authed.all(
  '/organizations.demoteAnAdmin',
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

authed.all(
  '/organizations.transferOwnership',
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

authed.all(
  '/organizations.disableUser',
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
  usersDisabledQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    organization: object.require(),
  }),
);
authed.all(
  '/organizations.enableUser',
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

authed.all(
  '/organizations.createStripeCustomer',
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

authed.all(
  '/organizations.cancelSubscription',
  valBody({
    organization_id: string.require(),
  }),
  organizationsGetSingle,
  organizationsCheckAdminRights,
  organizationsCancelSubscription,
  organizationsUpdatedQueueMessage,
  notificationsPushToQueue,
  mapLocals(locals => ({
    organization: organizationConcatUsers(locals),
  })),
  valResponseAndSend({
    organization: object.require(),
  }),
);

notAuthed.all(
  '/organizations.getInfoFromInvitationToken',
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
