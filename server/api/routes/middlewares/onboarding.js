import {
  string,
  object,
} from 'valjs';
import {
  generateWayOne,
  generateWayTwo,
  generateWayThree,
  generateWayFour,
} from './onboarding/way_one';
import {
  // generateSlackLikeId,
  valLocals,
} from '../../utils';

const SOFI_ID = 'USOFI';
const onboardingMilestoneData = valLocals('onboardingMilestoneData', {
  organizationId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    organizationId,
  } = res.locals;

  setLocals({
    title: 'Example: Website update',
    organization_id: organizationId,
  });

  return next();
});
const onboardingGoalOneData = valLocals('onboardingGoalOneData', {
  original_user_id: string.require(),
  organizationId: string.require(),
  milestone: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    organizationId,
    milestone,
  } = res.locals;

  setLocals({
    way: generateWayOne(original_user_id),
    organization_id: organizationId,
    milestone_id: milestone.id,
    goal: {
      title: 'Marketing campaign',
      assignees: [SOFI_ID, original_user_id],
    },
  });

  return next();
});
const onboardingGoalTwoData = valLocals('onboardingGoalTwoData', {
  original_user_id: string.require(),
  organizationId: string.require(),
  milestone: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    organizationId,
    milestone,
  } = res.locals;

  setLocals({
    way: generateWayTwo(original_user_id),
    organization_id: organizationId,
    milestone_id: milestone.id,
    goal: {
      title: 'Development',
      assignees: [SOFI_ID, original_user_id],
    },
  });

  return next();
});
const onboardingGoalThreeData = valLocals('onboardingGoalThreeData', {
  original_user_id: string.require(),
  organizationId: string.require(),
  milestone: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    organizationId,
    milestone,
  } = res.locals;

  setLocals({
    way: generateWayThree(original_user_id),
    organization_id: organizationId,
    milestone_id: milestone.id,
    goal: {
      title: 'Design',
      assignees: [SOFI_ID, original_user_id],
    },
  });

  return next();
});
const onboardingGoalFourData = valLocals('onboardingGoalFourData', {
  original_user_id: string.require(),
  organizationId: string.require(),
  milestone: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    organizationId,
    milestone,
  } = res.locals;

  setLocals({
    way: generateWayFour(original_user_id),
    organization_id: organizationId,
    milestone_id: milestone.id,
    goal: {
      title: 'Website copy',
      assignees: [SOFI_ID, original_user_id],
      completed_at: new Date(),
    },
  });

  return next();
});
const onboardingPost_1 = valLocals('onboardingPost_1', {
  original_user_id: string.require(),
  goal: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    goal,
  } = res.locals;
  const message = `Hey, I'm making progress on the documents for the new website. I've added a few of the core ideas down.

  Can you please review our brand guidelines and tell me if any changes are needed?
  `;

  setLocals({
    message,
    user_id: 'USOFI',
    type: 'question',
    context: {
      id: goal.id,
      title: goal.title,
    },
    reactions: [{
      created_by: original_user_id,
      reaction: 'like',
    }],
    tagged_users: [original_user_id],
  });

  return next();
});
const onboardingCommentsPost_1_1 = valLocals('onboardingCommentsPost_1_1', {
  original_user_id: string.require(),
  post: object.require(),
}, (req, res, next, setLocals) => {
  const {
    post,
    original_user_id,
  } = res.locals;

  setLocals({
    user_id: original_user_id,
    post_id: post.id,
    message: 'Great progress, SOFI. I\'ve added the color scheme in the goal and I\'ll be working on the next steps for the rest of the day 😊',
  });

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

  setLocals({
    message,
    user_id: original_user_id,
    type: 'announcement',
    context: {
      id: goal.id,
      title: goal.title,
    },
    reactions: [{
      created_by: 'USOFI',
      reaction: 'like',
    }],
    tagged_users: ['USOFI'],
  });

  return next();
});
const onboardingCommentsPost_2_1 = valLocals('onboardingCommentsPost_2_1', {
  original_user_id: string.require(),
  post: object.require(),
}, (req, res, next, setLocals) => {
  const {
    post,
    original_user_id,
  } = res.locals;

  setLocals({
    user_id: 'USOFI',
    post_id: post.id,
    message: 'Wonderful! I\'m all in on helping eat the cookies after the photoshoot',
    reactions: [{
      created_by: original_user_id,
      reaction: 'like',
    }],
  });

  return next();
});
const onboardingCommentsPost_2_2 = valLocals('onboardingCommentsPost_2_2', {
  original_user_id: string.require(),
  post: object.require(),
}, (req, res, next, setLocals) => {
  const {
    post,
    original_user_id,
  } = res.locals;

  setLocals({
    user_id: original_user_id,
    post_id: post.id,
    message: '😆 me too!',
  });

  return next();
});
const onboardingPost_3 = valLocals('onboardingPost_3', {
  original_user_id: string.require(),
  context: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    context,
  } = res.locals;
  const message = 'Can you please help me fill in the messaging plan? My hands are full with the social media campaign and really need your help!';


  setLocals({
    message,
    context,
    user_id: 'USOFI',
    type: 'question',
    tagged_users: [original_user_id],
  });

  return next();
});
const onboardingPost_4 = valLocals('onboardingPost_4', {
  original_user_id: string.require(),
  goal: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    goal,
  } = res.locals;
  const message = 'Hey S.O.F.I. see this new campaign we made around a new chocolate recipe. I\'m a big fan. You?';


  setLocals({
    message,
    user_id: original_user_id,
    type: 'information',
    context: {
      id: goal.id,
      title: goal.title,
    },
    reactions: [{
      created_by: 'USOFI',
      reaction: 'like',
    }],
    tagged_users: ['USOFI'],
  });

  return next();
});
const onboardingCommentsPost_4_1 = valLocals('onboardingCommentsPost_4_1', {
  post: object.require(),
}, (req, res, next, setLocals) => {
  const {
    post,
  } = res.locals;

  setLocals({
    user_id: 'USOFI',
    post_id: post.id,
    message: 'That\'s a great post @User. I love how you engaged our fans into a discussion. Good job on that!',
  });

  return next();
});
const onboardingPost_5 = valLocals('onboardingPost_5', {
  original_user_id: string.require(),
  goal: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    goal,
  } = res.locals;
  const message = `I'm half-way through the marketing plan but need someone else on the team to go through it. Who is our epic marketing person working on the mobile project?
  
  Can we get her to join in and help out?`;


  setLocals({
    message,
    user_id: 'USOFI',
    type: 'question',
    context: {
      id: goal.id,
      title: goal.title,
    },
    reactions: [{
      created_by: original_user_id,
      reaction: 'like',
    }],
    tagged_users: [original_user_id],
  });

  return next();
});
const onboardingCommentsPost_5_1 = valLocals('onboardingCommentsPost_5_1', {
  original_user_id: string.require(),
  post: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    post,
  } = res.locals;

  setLocals({
    user_id: original_user_id,
    post_id: post.id,
    message: 'Sure, I\'m adding her to the conversation.',
  });

  return next();
});
const onboardingPost_6 = valLocals('onboardingPost_6', {
  original_user_id: string.require(),
  goal: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    goal,
  } = res.locals;
  const message = `Hey S.O.F.I. here is the test for the website. I focused on colors, multi-screen optimization and the fun mascots we've used before.
  
  What are your initial thoughts? How can we improve it?`;

  setLocals({
    message,
    user_id: original_user_id,
    type: 'information',
    context: {
      id: goal.id,
      title: goal.title,
    },
    reactions: [{
      created_by: 'USOFI',
      reaction: 'like',
    }],
    tagged_users: ['USOFI'],
  });

  return next();
});
const onboardingCommentsPost_6_1 = valLocals('onboardingCommentsPost_6_1', {
  post: object.require(),
}, (req, res, next, setLocals) => {
  const {
    post,
  } = res.locals;

  setLocals({
    user_id: 'USOFI',
    post_id: post.id,
    message: 'Nice work! It was so much fun to follow the storyline of the content and scroll along. You and the designer have done great work incorporating the mascots and building content & scenarious around them. I suggest we make the first section focus on Title & product images and keep the stories for the Product details page. What do you think about that?',
  });

  return next();
});
const onboardingCommentsPost_6_2 = valLocals('onboardingCommentsPost_6_2', {
  original_user_id: string.require(),
  post: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    post,
  } = res.locals;

  setLocals({
    user_id: original_user_id,
    post_id: post.id,
    message: 'Sure! That sounds good. I\'ll make a change and send you a new version.',
    reactions: [{
      created_by: 'USOFI',
      reaction: 'like',
    }],
  });

  return next();
});
const onboardingCommentsPost_6_3 = valLocals('onboardingCommentsPost_6_3', {
  original_user_id: string.require(),
  post: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    post,
  } = res.locals;

  setLocals({
    user_id: original_user_id,
    post_id: post.id,
    message: 'S.O.F.I., I simplified the content and focused the main page on showcasing the new product line. What do you think about this version',
    reactions: [{
      created_by: 'USOFI',
      reaction: 'like',
    }],
  });

  return next();
});
const onboardingCommentsPost_6_4 = valLocals('onboardingCommentsPost_6_4', {
  original_user_id: string.require(),
  post: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    post,
  } = res.locals;

  setLocals({
    user_id: 'USOFI',
    post_id: post.id,
    message: 'Wow, that\'s exactly as I imagined it as well. Great work! Let\'s move ahead with it and get the development team to update it!',
    reactions: [{
      created_by: original_user_id,
      reaction: 'like',
    }],
  });

  return next();
});
const onboardingCommentsPost_6_5 = valLocals('onboardingCommentsPost_6_5', {
  original_user_id: string.require(),
  post: object.require(),
}, (req, res, next, setLocals) => {
  const {
    original_user_id,
    post,
  } = res.locals;

  setLocals({
    user_id: original_user_id,
    post_id: post.id,
    message: '👏 Sounds great! Thanks for all the help!',
    reactions: [{
      created_by: 'USOFI',
      reaction: 'like',
    }],
  });

  return next();
});

export {
  onboardingMilestoneData,
  onboardingGoalOneData,
  onboardingGoalTwoData,
  onboardingGoalThreeData,
  onboardingGoalFourData,
  onboardingPost_1,
  onboardingCommentsPost_1_1,
  onboardingPost_2,
  onboardingCommentsPost_2_1,
  onboardingCommentsPost_2_2,
  onboardingPost_3,
  onboardingPost_4,
  onboardingCommentsPost_4_1,
  onboardingPost_5,
  onboardingCommentsPost_5_1,
  onboardingPost_6,
  onboardingCommentsPost_6_1,
  onboardingCommentsPost_6_2,
  onboardingCommentsPost_6_3,
  onboardingCommentsPost_6_4,
  onboardingCommentsPost_6_5,
};
