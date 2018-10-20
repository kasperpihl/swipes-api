import { string } from 'valjs';
import { organizationsAddMilestone } from './organizations';
import {
  milestonesCreate,
  milestonesInsert,
  milestonesAddGoal,
} from './milestones';
import {
  goalsCreate,
  goalsInsert,
  goalsAppendWayToGoal,
  goalsCompleteGoal,
} from './goals';
import { notesCreate } from './notes';
import {
  waysModifyStepsAndAttachmentsInWay,
  waysGetNoteContentFromWayAttachmets,
  waysModifyNotesContentInWayAttachments,
} from './ways';
import { linksCreateBatch, linksAddPermissionBatch } from './links';
import { usersGetSingleWithOrganizations } from './users';
import { generateWayOne } from './onboarding/way_one';
import { generateWayTwo } from './onboarding/way_two';
import { generateWayThree } from './onboarding/way_three';
import { generateWayFour } from './onboarding/way_four';
import { valLocals, mapLocals, getSwipesLinkObj } from '../../utils';

const SOFI_ID = 'USOFI';
// const MAX_LENGHT = 50;
const onboardingMilestoneData = valLocals(
  'onboardingMilestoneData',
  {
    organization_id: string.require(),
  },
  (req, res, next, setLocals) => {
    const { organization_id } = res.locals;

    setLocals({
      organization_id,
      title: 'Example: Website update',
    });

    return next();
  },
);
const onboardingGoalOneData = valLocals(
  'onboardingGoalOneData',
  {
    original_user_id: string.require(),
    organization_id: string.require(),
  },
  (req, res, next, setLocals) => {
    const { original_user_id, organization_id } = res.locals;

    setLocals({
      organization_id,
      way: generateWayOne(original_user_id),
      goal: {
        title: 'Marketing campaign',
        assignees: [SOFI_ID, original_user_id],
      },
    });

    return next();
  },
);
const onboardingGoalTwoData = valLocals(
  'onboardingGoalTwoData',
  {
    original_user_id: string.require(),
    organization_id: string.require(),
  },
  (req, res, next, setLocals) => {
    const { original_user_id, organization_id } = res.locals;

    setLocals({
      organization_id,
      way: generateWayTwo(original_user_id),
      goal: {
        title: 'Development',
        assignees: [SOFI_ID, original_user_id],
      },
    });

    return next();
  },
);
const onboardingGoalThreeData = valLocals(
  'onboardingGoalThreeData',
  {
    original_user_id: string.require(),
    organization_id: string.require(),
  },
  (req, res, next, setLocals) => {
    const { original_user_id, organization_id } = res.locals;

    setLocals({
      organization_id,
      way: generateWayThree(original_user_id),
      goal: {
        title: 'Design',
        assignees: [SOFI_ID, original_user_id],
      },
    });

    return next();
  },
);
const onboardingGoalFourData = valLocals(
  'onboardingGoalFourData',
  {
    original_user_id: string.require(),
    organization_id: string.require(),
  },
  (req, res, next, setLocals) => {
    const { original_user_id, organization_id } = res.locals;

    setLocals({
      organization_id,
      way: generateWayFour(original_user_id),
      goal: {
        title: 'Website copy',
        assignees: [SOFI_ID, original_user_id],
      },
    });

    return next();
  },
);
const onboardingGetMiddlewares = [
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
  mapLocals(locals => ({
    milestone_id: locals.milestone.id,
  })),
  organizationsAddMilestone,
  // Goal one
  onboardingGoalThreeData,
  goalsCreate,
  goalsInsert,
  mapLocals(locals => ({
    goal_id: locals.goal.id,
  })),
  milestonesAddGoal,
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
  // Goal two
  onboardingGoalTwoData,
  goalsCreate,
  goalsInsert,
  mapLocals(locals => ({
    goal_id: locals.goal.id,
  })),
  milestonesAddGoal,
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
  // Goals three
  onboardingGoalOneData,
  goalsCreate,
  goalsInsert,
  mapLocals(locals => ({
    goal_id: locals.goal.id,
  })),
  milestonesAddGoal,
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
  // Goals four
  onboardingGoalFourData,
  goalsCreate,
  goalsInsert,
  mapLocals(locals => ({
    goal_id: locals.goal.id,
  })),
  milestonesAddGoal,
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
  goalsCompleteGoal,
];

export { onboardingGetMiddlewares };
