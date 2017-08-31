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
  organizationsCreateUpdateSubscriptionCustomer,
} from './middlewares/organizations';
import {
  usersGetSingleWithOrganizations,
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
  onboardingMilestoneData,
  onboardingGoalOneData,
  onboardingGoalTwoData,
  onboardingGoalThreeData,
  onboardingGoalFourData,
  onboardingAttachmentPost_1,
  onboardingPost_1,
  onboardingCommentsPost_1_1,
  onboardingPost_2,
  onboardingCommentsPost_2_1,
  onboardingCommentsPost_2_2,
  onboardingPost_3,
  onboardingAttachmentPost_4,
  onboardingPost_4,
  onboardingCommentsPost_4_1,
  onboardingPost_5,
  onboardingCommentsPost_5_1,
  onboardingAttachmentPost_6,
  onboardingPost_6,
  onboardingCommentsPost_6_1,
  onboardingCommentsPost_6_2,
  onboardingCommentsPost_6_3,
  onboardingCommentsPost_6_4,
  onboardingCommentsPost_6_5,
  onboardingPost_7,
  onboardingPost_8,
  onboardingCommentsPost_8_1,
} from './middlewares/onboarding';
import {
  milestonesCreate,
  milestonesInsert,
} from './middlewares/milestones';
import {
  goalsCreate,
  goalsInsert,
  goalsAppendWayToGoal,
} from './middlewares/goals';
import {
  postsCreate,
  postsInsertSingle,
  postsCreateComment,
  postsAddComment,
} from './middlewares/posts';
import {
  notesCreate,
} from './middlewares/notes';
import {
  waysModifyStepsAndAttachmentsInWay,
  waysGetNoteContentFromWayAttachmets,
  waysModifyNotesContentInWayAttachments,
} from './middlewares/ways';
import {
  linksCreate,
  linksAddPermission,
  linksCreateBatch,
  linksAddPermissionBatch,
} from './middlewares/links';
import {
  valBody,
  valResponseAndSend,
  mapLocals,
  getSwipesLinkObj,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/organizations.create',
  valBody({
    organization_name: string.require(),
  }),
  organizationsCreate,
  organizationsAddToUser,
  usersGetSingleWithOrganizations,
  mapLocals((locals) => {
    return {
      original_user_id: locals.user_id,
    };
  }),
  // Creating onboarding content
  // Milestone
  onboardingMilestoneData,
  milestonesCreate,
  milestonesInsert,
  // Goal one
  onboardingGoalThreeData,
  goalsCreate,
  goalsInsert,
  // Loading a way
  waysModifyStepsAndAttachmentsInWay,
  waysGetNoteContentFromWayAttachmets,
  mapLocals(locals => ({
    text: locals.texts,
  })),
  notesCreate,
  mapLocals((locals) => {
    const notes = locals.notes;
    const notesAttachment = locals.notesAttachment;
    const links = [];

    notes.forEach((note, i) => {
      const options = {
        type: 'note',
        id: note.id,
        title: notesAttachment[i].title,
        account_id: locals.user_id,
      };

      links.push(getSwipesLinkObj({ ...options }));
    });

    return { links };
  }),
  linksCreateBatch,
  linksAddPermissionBatch,
  mapLocals((locals) => {
    const short_urls = locals.short_urls;
    const links = locals.links.map((link, i) => {
      return Object.assign({}, link, {
        short_url: short_urls[i],
      });
    });

    return { links };
  }),
  waysModifyNotesContentInWayAttachments,
  goalsAppendWayToGoal,
  // Create post
  onboardingAttachmentPost_1,
  linksCreate,
  linksAddPermission,
  mapLocals((locals) => {
    const link = locals.link;
    const short_url = locals.short_url;
    const linkWithPermissions = Object.assign({}, link, {
      short_url,
    });
    const attachments = [{
      link: linkWithPermissions,
    }];

    return { attachments };
  }),
  onboardingPost_1,
  postsCreate,
  postsInsertSingle,
  // Create comments for post
  onboardingCommentsPost_1_1,
  postsCreateComment,
  postsAddComment,
  // Create second post
  onboardingPost_2,
  postsCreate,
  postsInsertSingle,
  // Create comments for second post
  onboardingCommentsPost_2_1,
  postsCreateComment,
  postsAddComment,
  onboardingCommentsPost_2_2,
  postsCreateComment,
  postsAddComment,
  // Goal two
  onboardingGoalTwoData,
  goalsCreate,
  goalsInsert,
  // Loading a way
  waysModifyStepsAndAttachmentsInWay,
  waysGetNoteContentFromWayAttachmets,
  mapLocals(locals => ({
    text: locals.texts,
  })),
  notesCreate,
  mapLocals((locals) => {
    const notes = locals.notes;
    const notesAttachment = locals.notesAttachment;
    const links = [];

    // We need that later for the post context
    let context;

    notes.forEach((note, i) => {
      const title = notesAttachment[i].title;
      const options = {
        title,
        type: 'note',
        id: note.id,
        account_id: locals.user_id,
      };

      links.push(getSwipesLinkObj({ ...options }));

      if (title === 'Specifications') {
        context = {
          title,
          id: note.id,
        };
      }
    });

    return { links, context };
  }),
  linksCreateBatch,
  linksAddPermissionBatch,
  mapLocals((locals) => {
    const short_urls = locals.short_urls;
    const links = locals.links.map((link, i) => {
      return Object.assign({}, link, {
        short_url: short_urls[i],
      });
    });

    return { links };
  }),
  waysModifyNotesContentInWayAttachments,
  goalsAppendWayToGoal,
  onboardingPost_8,
  postsCreate,
  postsInsertSingle,
  onboardingCommentsPost_8_1,
  postsCreateComment,
  postsAddComment,
  // Goals three
  onboardingGoalOneData,
  goalsCreate,
  goalsInsert,
  // Loading a way
  waysModifyStepsAndAttachmentsInWay,
  waysGetNoteContentFromWayAttachmets,
  mapLocals(locals => ({
    text: locals.texts,
  })),
  notesCreate,
  mapLocals((locals) => {
    const notes = locals.notes;
    const notesAttachment = locals.notesAttachment;
    const links = [];
    // We need this for the past
    let context = {};

    notes.forEach((note, i) => {
      const title = notesAttachment[i].title;
      const options = {
        title,
        type: 'note',
        id: note.id,
        account_id: locals.user_id,
      };

      links.push(getSwipesLinkObj({ ...options }));

      if (title === 'Messaging') {
        context = {
          title,
          id: note.id,
        };
      }
    });

    return { links, context };
  }),
  linksCreateBatch,
  linksAddPermissionBatch,
  mapLocals((locals) => {
    const short_urls = locals.short_urls;
    const links = locals.links.map((link, i) => {
      return Object.assign({}, link, {
        short_url: short_urls[i],
      });
    });

    return { links };
  }),
  waysModifyNotesContentInWayAttachments,
  goalsAppendWayToGoal,
  // Create Post
  onboardingPost_3,
  postsCreate,
  postsInsertSingle,
  // Create Post
  onboardingAttachmentPost_4,
  linksCreate,
  linksAddPermission,
  mapLocals((locals) => {
    const link = locals.link;
    const short_url = locals.short_url;
    const linkWithPermissions = Object.assign({}, link, {
      short_url,
    });
    const attachments = [{
      link: linkWithPermissions,
    }];

    return { attachments };
  }),
  onboardingPost_4,
  postsCreate,
  postsInsertSingle,
  onboardingCommentsPost_4_1,
  postsCreateComment,
  postsAddComment,
  // Create Post
  onboardingPost_5,
  postsCreate,
  postsInsertSingle,
  onboardingCommentsPost_5_1,
  postsCreateComment,
  postsAddComment,
  // Goals four
  onboardingGoalFourData,
  goalsCreate,
  goalsInsert,
  // Loading a way
  waysModifyStepsAndAttachmentsInWay,
  waysGetNoteContentFromWayAttachmets,
  mapLocals(locals => ({
    text: locals.texts,
  })),
  notesCreate,
  mapLocals((locals) => {
    const notes = locals.notes;
    const notesAttachment = locals.notesAttachment;
    const links = [];

    notes.forEach((note, i) => {
      const options = {
        type: 'note',
        id: note.id,
        title: notesAttachment[i].title,
        account_id: locals.user_id,
      };

      links.push(getSwipesLinkObj({ ...options }));
    });

    return { links };
  }),
  linksCreateBatch,
  linksAddPermissionBatch,
  mapLocals((locals) => {
    const short_urls = locals.short_urls;
    const links = locals.links.map((link, i) => {
      return Object.assign({}, link, {
        short_url: short_urls[i],
      });
    });

    return { links };
  }),
  waysModifyNotesContentInWayAttachments,
  goalsAppendWayToGoal,
  // Create post
  onboardingAttachmentPost_6,
  linksCreate,
  linksAddPermission,
  mapLocals((locals) => {
    const link = locals.link;
    const short_url = locals.short_url;
    const linkWithPermissions = Object.assign({}, link, {
      short_url,
    });
    const attachments = [{
      link: linkWithPermissions,
    }];

    return { attachments };
  }),
  onboardingPost_6,
  postsCreate,
  postsInsertSingle,
  // Create comments for post
  onboardingCommentsPost_6_1,
  postsCreateComment,
  postsAddComment,
  onboardingCommentsPost_6_2,
  postsCreateComment,
  postsAddComment,
  onboardingCommentsPost_6_3,
  postsCreateComment,
  postsAddComment,
  onboardingCommentsPost_6_4,
  postsCreateComment,
  postsAddComment,
  onboardingCommentsPost_6_5,
  postsCreateComment,
  postsAddComment,
  // Create post
  onboardingPost_7,
  postsCreate,
  postsInsertSingle,
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
  organizationsCreateUpdateSubscriptionCustomer,
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
  organizationsCreateUpdateSubscriptionCustomer,
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
  organizationsCreateUpdateSubscriptionCustomer,
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
