import {
  string,
  object,
  array,
} from 'valjs';
import {
  organizationsAddMilestone,
} from './organizations';
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
import {
  notesCreate,
} from './notes';
import {
  waysModifyStepsAndAttachmentsInWay,
  waysGetNoteContentFromWayAttachmets,
  waysModifyNotesContentInWayAttachments,
} from './ways';
import {
  linksCreate,
  linksAddPermission,
  linksCreateBatch,
  linksAddPermissionBatch,
} from './links';
import {
  usersGetSingleWithOrganizations,
} from './users';
import {
  generateWayOne,
} from './onboarding/way_one';
import {
  generateWayTwo,
} from './onboarding/way_two';
import {
  generateWayThree,
} from './onboarding/way_three';
import {
  generateWayFour,
} from './onboarding/way_four';
import {
  valLocals,
  mapLocals,
  getSwipesLinkObj,
} from '../../utils';
import { discussionAddMiddlewareWithNext } from '../../../endpoints/discussion/discussion.add';
import { commentAddMiddlewareWithNext } from '../../../endpoints/comment/comment.add';

const SOFI_ID = 'USOFI';
// const MAX_LENGHT = 50;
const onboardingMilestoneData = valLocals('onboardingMilestoneData', {
  organization_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
  } = res.locals;

  setLocals({
    organization_id,
    title: 'Example: Website update',
  });

  return next();
});
const onboardingGoalOneData = valLocals('onboardingGoalOneData', {
  original_user_id: string.require(),
  organization_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    organization_id,
  } = res.locals;

  setLocals({
    organization_id,
    way: generateWayOne(original_user_id),
    goal: {
      title: 'Marketing campaign',
      assignees: [SOFI_ID, original_user_id],
    },
  });

  return next();
});
const onboardingGoalTwoData = valLocals('onboardingGoalTwoData', {
  original_user_id: string.require(),
  organization_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    organization_id,
  } = res.locals;

  setLocals({
    organization_id,
    way: generateWayTwo(original_user_id),
    goal: {
      title: 'Development',
      assignees: [SOFI_ID, original_user_id],
    },
  });

  return next();
});
const onboardingGoalThreeData = valLocals('onboardingGoalThreeData', {
  original_user_id: string.require(),
  organization_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    organization_id,
  } = res.locals;

  setLocals({
    organization_id,
    way: generateWayThree(original_user_id),
    goal: {
      title: 'Design',
      assignees: [SOFI_ID, original_user_id],
    },
  });

  return next();
});
const onboardingGoalFourData = valLocals('onboardingGoalFourData', {
  original_user_id: string.require(),
  organization_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    organization_id,
  } = res.locals;

  setLocals({
    organization_id,
    way: generateWayFour(original_user_id),
    goal: {
      title: 'Website copy',
      assignees: [SOFI_ID, original_user_id],
    },
  });

  return next();
});
const onboardingAttachmentPost_1 = valLocals('onboardingAttachmentPost_1', {
}, (req, res, next, setLocals) => {
  const link = {
    service: {
      id: 'https://issuu.com/ninapatel/docs/m_m',
      name: 'swipes',
      type: 'url',
    },
    permission: {
      account_id: 'USOFI',
    },
    meta: {
      title: 'https://issuu.com/ninapatel/docs/m_m',
    },
  };

  setLocals({
    link,
  });

  return next();
});
const onboardingPost_1 = valLocals('onboardingPost_1', {
  original_user_id: string.require(),
  goal: object.require(),
  attachments: array.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    goal,
  } = res.locals;
  const message = `Hey, I'm making progress on the documents for the new website. I've added a few of the core ideas down.

  Can you please review our brand guidelines and tell me if any changes are needed?
  `;

  // setLocals({
  //   message,
  //   user_id: 'USOFI',
  //   type: 'question',
  //   context: {
  //     id: goal.id,
  //     title: goal.title,
  //   },
  //   reactions: [{
  //     created_by: original_user_id,
  //     reaction: 'like',
  //   }],
  //   tagged_users: [original_user_id],
  // });

  res.locals.input = {
    organization_id: res.locals.organization_id,
    user_id: 'USOFI',
    context: {
      id: goal.id,
      title: goal.title,
    },
    message,
    followers: [original_user_id],
  };

  return next();
});
const onboardingCommentsPost_1_1 = valLocals('onboardingCommentsPost_1_1', {
  original_user_id: string.require(),
  discussion: object.require(),
}, (req, res, next, setLocals) => {
  const {
    discussion,
    original_user_id,
  } = res.locals;

  res.locals.input = {
    organization_id: res.locals.organization_id,
    user_id: original_user_id,
    discussion_id: discussion.id,
    message: 'Great progress, SOFI. I\'ve added the color scheme in the goal and I\'ll be working on the next steps for the rest of the day 😊',
  };

  return next();
});
const onboardingPost_2 = valLocals('onboardingPost_2', {
  original_user_id: string.require(),
  goal: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    goal,
  } = res.locals;
  const message = 'Done with the moodboard. S.O.F.I, I\'ve scheduled a photoshoot with cookies for the main website photo.';

  res.locals.input = {
    organization_id: res.locals.organization_id,
    user_id: original_user_id,
    context: {
      id: goal.id,
      title: goal.title,
    },
    message,
    followers: ['USOFI'],
  };

  return next();
});
const onboardingCommentsPost_2_1 = valLocals('onboardingCommentsPost_2_1', {
  discussion: object.require(),
}, (req, res, next, setLocals) => {
  const {
    discussion,
  } = res.locals;

  res.locals.input = {
    organization_id: res.locals.organization_id,
    user_id: 'USOFI',
    discussion_id: discussion.id,
    message: 'Wonderful! I\'m all in on helping eat the cookies after the photoshoot',
  };

  return next();
});
const onboardingCommentsPost_2_2 = valLocals('onboardingCommentsPost_2_2', {
  original_user_id: string.require(),
  discussion: object.require(),
}, (req, res, next, setLocals) => {
  const {
    discussion,
    original_user_id,
  } = res.locals;

  res.locals.input = {
    organization_id: res.locals.organization_id,
    user_id: original_user_id,
    discussion_id: discussion.id,
    message: '😆 me too!',
  };

  return next();
});
const onboardingPost_3 = valLocals('onboardingPost_3', {
  user: object.require(),
  original_user_id: string.require(),
  context: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user,
    original_user_id,
    context,
  } = res.locals;
  const message = `${user.profile.first_name}, can you please help me fill in the messaging plan? My hands are full with the social media campaign and really need your help!`;

  res.locals.input = {
    organization_id: res.locals.organization_id,
    user_id: 'USOFI',
    context,
    message,
    followers: [original_user_id],
  };

  return next();
});
const onboardingAttachmentPost_4 = valLocals('onboardingAttachmentPost_4', {
  original_user_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
  } = res.locals;
  const link = {
    service: {
      id: 'https://www.facebook.com/mms/videos/vb.30634981956/10154663918731957/?type=2&theater',
      name: 'swipes',
      type: 'url',
    },
    permission: {
      account_id: original_user_id,
    },
    meta: {
      title: 'https://www.facebook.com/mms/videos/vb.30634981956/10154663918731957/?type=2&theater',
    },
  };

  setLocals({
    link,
  });

  return next();
});
const onboardingPost_4 = valLocals('onboardingPost_4', {
  original_user_id: string.require(),
  goal: object.require(),
  attachments: array.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    goal,
    attachments,
  } = res.locals;
  const message = 'Hey S.O.F.I. see this new campaign we made around a new chocolate recipe. I\'m a big fan. You?';

  res.locals.input = {
    organization_id: res.locals.organization_id,
    user_id: original_user_id,
    context: {
      id: goal.id,
      title: goal.title,
    },
    message,
    followers: ['USOFI'],
    attachments,
  };

  return next();
});
const onboardingCommentsPost_4_1 = valLocals('onboardingCommentsPost_4_1', {
  discussion: object.require(),
  user: object.require(),
}, (req, res, next, setLocals) => {
  const {
    discussion,
    user,
  } = res.locals;

  res.locals.input = {
    organization_id: res.locals.organization_id,
    user_id: 'USOFI',
    discussion_id: discussion.id,
    message: `That's a great post ${user.profile.first_name}. I love how you engaged our fans into a discussion. Good job on that!`,
  };

  return next();
});
const onboardingPost_5 = valLocals('onboardingPost_5', {
  original_user_id: string.require(),
  goal: object.require(),
  user: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    goal,
    user,
  } = res.locals;
  const message = `I'm half-way through the marketing plan but need someone else on the team to go through it. ${user.profile.first_name} who is our epic marketing person working on the mobile project?
  
  Can we get her to join in and help out?`;

  res.locals.input = {
    organization_id: res.locals.organization_id,
    user_id: 'USOFI',
    context: {
      id: goal.id,
      title: goal.title,
    },
    message,
    followers: [original_user_id],
  };

  return next();
});
const onboardingCommentsPost_5_1 = valLocals('onboardingCommentsPost_5_1', {
  original_user_id: string.require(),
  discussion: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    discussion,
  } = res.locals;

  res.locals.input = {
    organization_id: res.locals.organization_id,
    user_id: original_user_id,
    discussion_id: discussion.id,
    message: 'Sure, I\'m adding her to the conversation.',
  };

  return next();
});
const onboardingAttachmentPost_6 = valLocals('onboardingAttachmentPost_6', {
  original_user_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
  } = res.locals;
  const link = {
    service: {
      id: 'http://swipesapp.com/blog/why-create-a-better-way-of-working/',
      name: 'swipes',
      type: 'url',
    },
    permission: {
      account_id: original_user_id,
    },
    meta: {
      title: 'http://swipesapp.com/blog/why-create-a-better-way-of-working/',
    },
  };

  setLocals({
    link,
  });

  return next();
});
const onboardingPost_6 = valLocals('onboardingPost_6', {
  original_user_id: string.require(),
  goal: object.require(),
  attachments: array.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    goal,
    attachments,
  } = res.locals;
  const message = `Hey S.O.F.I. here is the test for the website. I focused on colors, multi-screen optimization and the fun mascots we've used before.
  
  What are your initial thoughts? How can we improve it?`;

  res.locals.input = {
    organization_id: res.locals.organization_id,
    user_id: original_user_id,
    context: {
      id: goal.id,
      title: goal.title,
    },
    message,
    followers: ['USOFI'],
    attachments,
  };

  return next();
});
const onboardingCommentsPost_6_1 = valLocals('onboardingCommentsPost_6_1', {
  discussion: object.require(),
  user: object.require(),
}, (req, res, next, setLocals) => {
  const {
    discussion,
    user,
  } = res.locals;

  res.locals.input = {
    organization_id: res.locals.organization_id,
    user_id: 'USOFI',
    discussion_id: discussion.id,
    message: `Nice work, ${user.profile.first_name}! It was so much fun to follow the storyline of the content and scroll along. You and the designer have done great work incorporating the mascots and building content & scenarious around them. I suggest we make the first section focus on Title & product images and keep the stories for the Product details page. What do you think about that?`,
  };

  return next();
});
const onboardingCommentsPost_6_2 = valLocals('onboardingCommentsPost_6_2', {
  original_user_id: string.require(),
  discussion: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    discussion,
  } = res.locals;

  res.locals.input = {
    organization_id: res.locals.organization_id,
    user_id: original_user_id,
    discussion_id: discussion.id,
    message: 'Sure! That sounds good. I\'ll make a change and send you a new version.',
  };

  return next();
});
const onboardingCommentsPost_6_3 = valLocals('onboardingCommentsPost_6_3', {
  original_user_id: string.require(),
  discussion: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    discussion,
  } = res.locals;

  res.locals.input = {
    organization_id: res.locals.organization_id,
    user_id: original_user_id,
    discussion_id: discussion.id,
    message: 'S.O.F.I., I simplified the content and focused the main page on showcasing the new product line. What do you think about this version',
  };

  return next();
});
const onboardingCommentsPost_6_4 = valLocals('onboardingCommentsPost_6_4', {
  original_user_id: string.require(),
  discussion: object.require(),
  user: object.require(),
}, (req, res, next, setLocals) => {
  const {
    discussion,
    user,
  } = res.locals;

  res.locals.input = {
    organization_id: res.locals.organization_id,
    user_id: 'USOFI',
    discussion_id: discussion.id,
    message: `Wow, that's exactly as I imagined it as well. Great work, ${user.profile.first_name}! Let's move ahead with it and get the development team to update it!`,
  };

  return next();
});
const onboardingCommentsPost_6_5 = valLocals('onboardingCommentsPost_6_5', {
  original_user_id: string.require(),
  discussion: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    discussion,
  } = res.locals;

  res.locals.input = {
    organization_id: res.locals.organization_id,
    user_id: original_user_id,
    discussion_id: discussion.id,
    message: '👏 Sounds great! Thanks for all the help!',
  };

  return next();
});
const onboardingPost_7 = valLocals('onboardingPost_7', {
  original_user_id: string.require(),
  goal: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    goal,
  } = res.locals;
  const message = `The goal is completed! Thanks S.O.F.I. for the help! 
  Can't wait to see it updated on the website!`;

  res.locals.input = {
    organization_id: res.locals.organization_id,
    user_id: original_user_id,
    context: {
      id: goal.id,
      title: goal.title,
    },
    message,
    followers: ['USOFI'],
  };

  return next();
});
const onboardingPost_8 = valLocals('onboardingPost_8', {
  original_user_id: string.require(),
  context: object.require(),
  user: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    context,
    user,
  } = res.locals;
  const message = `Hi ${user.profile.first_name}, I've started filling in the requirements for the website but wasn't sure what your design constrains were.
  
  Can you please send them to me so I can update my part?`;

  res.locals.input = {
    organization_id: res.locals.organization_id,
    user_id: 'USOFI',
    context,
    message,
    followers: [original_user_id],
  };

  return next();
});
const onboardingCommentsPost_8_1 = valLocals('onboardingCommentsPost_8_1', {
  original_user_id: string.require(),
  discussion: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    discussion,
  } = res.locals;

  res.locals.input = {
    organization_id: res.locals.organization_id,
    user_id: original_user_id,
    discussion_id: discussion.id,
    message: 'Sure, S.O.F.I. I\'ve added all the design requirements to the bottom of the doc. :)',
  };

  return next();
});
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
      title: link.meta.title,
    }];

    return { attachments };
  }),
  onboardingPost_1,
  discussionAddMiddlewareWithNext,
  mapLocals((locals) => {
    return {
      discussion: locals.output.updates[0].data,
      attachments: [],
    };
  }),
  // Create comments for post
  onboardingCommentsPost_1_1,
  commentAddMiddlewareWithNext,
  // Create second post
  onboardingPost_2,
  discussionAddMiddlewareWithNext,
  mapLocals((locals) => {
    return {
      discussion: locals.output.updates[0].data,
    };
  }),
  // Create comments for second post
  onboardingCommentsPost_2_1,
  commentAddMiddlewareWithNext,
  onboardingCommentsPost_2_2,
  commentAddMiddlewareWithNext,
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
  onboardingPost_8,
  discussionAddMiddlewareWithNext,
  mapLocals((locals) => {
    return {
      discussion: locals.output.updates[0].data,
    };
  }),
  // onboardingNotificationPost,
  onboardingCommentsPost_8_1,
  commentAddMiddlewareWithNext,
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
  // Create Post
  onboardingPost_3,
  discussionAddMiddlewareWithNext,
  // Create notification
  // onboardingNotificationPost,
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
      title: link.meta.title,
    }];

    return { attachments };
  }),
  onboardingPost_4,
  discussionAddMiddlewareWithNext,
  mapLocals((locals) => {
    return {
      discussion: locals.output.updates[0].data,
      attachments: [],
    };
  }),
  onboardingCommentsPost_4_1,
  commentAddMiddlewareWithNext,
  // Create Post
  onboardingPost_5,
  discussionAddMiddlewareWithNext,
  mapLocals((locals) => {
    return {
      discussion: locals.output.updates[0].data,
    };
  }),
  // Create notification
  // onboardingNotificationPost,
  // Add comments to post
  onboardingCommentsPost_5_1,
  commentAddMiddlewareWithNext,
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
      title: link.meta.title,
    }];

    return { attachments };
  }),
  onboardingPost_6,
  discussionAddMiddlewareWithNext,
  mapLocals((locals) => {
    return {
      discussion: locals.output.updates[0].data,
      attachments: [],
    };
  }),
  // Create comments for post
  onboardingCommentsPost_6_1,
  commentAddMiddlewareWithNext,
  onboardingCommentsPost_6_2,
  commentAddMiddlewareWithNext,
  onboardingCommentsPost_6_3,
  commentAddMiddlewareWithNext,
  onboardingCommentsPost_6_4,
  commentAddMiddlewareWithNext,
  onboardingCommentsPost_6_5,
  commentAddMiddlewareWithNext,
  // Create post
  onboardingPost_7,
  discussionAddMiddlewareWithNext,
];

export {
  onboardingGetMiddlewares,
};
