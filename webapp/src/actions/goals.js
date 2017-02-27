import TabMenu from 'src/react/context-menus/tab-menu/TabMenu';
import SelectStep from 'src/react/context-menus/select-step/SelectStep';
import { List, Map } from 'immutable';
import GoalsUtil from 'classes/goals-util';
import * as a from './';

const updateGoal = (goalId, goal) => a.api.request('goals.update', {
  goal_id: goalId,
  goal: Object.assign({ id: goalId }, goal),
});

export const removeFromCollection = (goalId, id) => (d, getState) => {
  let attachments = getState().getIn(['goals', goalId, 'attachments']);
  if (!attachments) {
    attachments = Map();
  }
  attachments = attachments.delete(id).toJS();
  let attachmentOrder = getState().getIn(['goals', goalId, 'attachment_order']);
  if (!attachmentOrder) {
    attachmentOrder = List();
  }
  attachmentOrder = attachmentOrder.filter(at => at !== id).toJS();

  const goal = {
    attachments,
    id: goalId,
    attachment_order: attachmentOrder,
  };
  d({ type: 'goal_updated', payload: { data: goal } });
  return d(updateGoal(goalId, goal));
};

export const addToCollection = (goalId, content) => (d, getState) => {
  let attachments = getState().getIn(['goals', goalId, 'attachments']);
  if (!attachments) {
    attachments = Map();
  }

  attachments = attachments.set(content.shortUrl, content).toJS();
  let attachmentOrder = getState().getIn(['goals', goalId, 'attachment_order']);
  if (!attachmentOrder) {
    attachmentOrder = List();
  }
  attachmentOrder = attachmentOrder.push(content.shortUrl).toJS();

  return d(updateGoal(goalId, {
    attachments,
    attachment_order: attachmentOrder,
  }));
};

export const reassignStep = (goalId, stepId, assignees) => (d, getState) => {
  let steps = getState().getIn(['goals', goalId, 'steps']);
  steps = steps.setIn([stepId, 'assignees'], assignees).toJS();
  return d(updateGoal(goalId, { steps }));
};

export const removeStep = (goalId, stepId) => (d, getState) => {
  let steps = getState().getIn(['goals', goalId, 'steps']);
  let stepOrder = getState().getIn(['goals', goalId, 'step_order']);
  steps = steps.setIn([stepId, 'deleted'], true).toJS();
  stepOrder = stepOrder.filter(sId => sId !== stepId).toJS();
  return d(updateGoal(goalId, {
    steps,
    step_order: stepOrder,
  }));
};

export const renameStep = (goalId, stepId, title) => (d, getState) => {
  let steps = getState().getIn(['goals', goalId, 'steps']);
  steps = steps.setIn([stepId, 'title'], title).toJS();
  return d(updateGoal(goalId, { steps }));
};

export const archive = goalId => (d) => {
  d(a.main.modal(
    {
      title: 'Archive Goal?',
      data: {
        message: 'Are you sure you want to archive this goal?',
        buttons: ['Yes', 'No'],
      },
      type: 'warning',
    },
    (res) => {
      if (res && res.button === 0) {
        d(a.api.request('goals.archive', { goal_id: goalId }));
      }
    },
  ));
};

export const selectStep = (options, goalId, nextStepId, callback) => (d, getState) => {
  const goal = getState().getIn(['goals', goalId]);
  const helper = new GoalsUtil(goal);

  let steps = goal.get('steps');
  const sortedSteps = goal.get('step_order').map(sId => steps.get(sId));
  const currentStepId = goal.getIn(['status', 'current_step_id']);

  steps = sortedSteps.map(step => (Map({
    id: step.get('id'),
    title: step.get('title'),
    current: (step.get('id') === currentStepId),
    next: (step.get('id') === nextStepId),
  })));
  const numberOfCompleted = helper.getNumberOfCompletedSteps();
  const onClick = (id) => {
    d(a.main.contextMenu(null));
    callback(id);
  };

  d(a.main.contextMenu({
    options,
    component: SelectStep,
    props: {
      numberOfCompleted,
      steps,
      onClick,
    },
  }));
};

export const selectAssignees = (options, assignees, callback) => (d, getState) => {
  assignees = assignees || [];

  const state = getState();
  let currentRecent = state.getIn(['main', 'recentAssignees']) || [];
  if (currentRecent.size) {
    currentRecent = currentRecent.toJS();
  }

  const resultForUser = (user) => {
    if (!user) {
      return null;
    }
    const obj = {
      id: user.get('id'),
      title: `${user.get('first_name')} ${user.get('last_name')}`,
      subtitle: user.get('job_title'),
      rightIcon: {
        button: {
          icon: 'Person',
        },
      },
    };
    if (assignees.indexOf(user.get('id')) !== -1) {
      obj.rightIcon = {
        button: {
          icon: 'Close',
        },
      };
    }
    if (user.get('profile_pic')) {
      obj.leftIcon = {
        src: user.get('profile_pic'),
      };
    } else {
      obj.leftIcon = {
        initials: {
          color: 'white',
          backgroundColor: '#000C2F',
          letters: user.get('first_name').slice(0, 1),
        },
      };
    }
    return obj;
  };

  const resultForUserId = (userId) => {
    const user = state.getIn(['users', userId]);
    return resultForUser(user);
  };

  const sortedUsers = users => users.sort(
    (b, c) => b.get('first_name').localeCompare(c.get('first_name')),
  ).toArray();

  const allUsers = () => sortedUsers(state.get('users')).map(u => resultForUser(u));

  const searchForUser = q => sortedUsers(state.get('users')).map((u) => {
    if (
      u.get('first_name').toLowerCase().startsWith(q.toLowerCase()) ||
      u.get('last_name').toLowerCase().startsWith(q.toLowerCase())
    ) {
      return resultForUser(u);
    }
    return null;
  }).filter(v => !!v);

  const getRecent = () => currentRecent.map(uId => resultForUserId(uId));
  const getAssignees = () => assignees.map(uId => resultForUserId(uId));

  let tabMenu;
  const recent = [];
  const delegate = {
    onTabMenuLoad: (tMenu) => {
      tabMenu = tMenu;
    },
    numberOfTabs: () => 3,
    nameForTab: i => [`Assigned (${assignees.length})`, 'Recent', 'All'][i],
    onItemAction: (item, side) => {
      const index = assignees.indexOf(item.id);
      if (index === -1) {
        assignees.push(item.id);
        recent.unshift(item.id);
      } else {
        assignees.splice(index, 1);
      }
      if (side === 'enter') {
        d(a.main.contextMenu(null));
      }
      callback(assignees);
      tabMenu.reload();
      // side = [row || left || right]
    },
    resultsForSearch: query => searchForUser(query),
    resultsForTab: (tabIndex) => {
      if (tabIndex === 0) {
        return getAssignees();
      }
      if (tabIndex === 1) {
        return getRecent();
      }
      if (tabIndex === 2) {
        return allUsers();
      }
      return [];
    },
  };
  let initialTabIndex = 2;
  if (currentRecent.length) {
    initialTabIndex = 1;
  }
  if (assignees.length) {
    initialTabIndex = 0;
  }

  d(a.main.contextMenu({
    options,
    component: TabMenu,
    onClose: () => {
      if (recent.length) {
        d(a.main.updateRecentAssignees(recent));
      }
      callback();
    },
    props: {
      search: 'Search for name or email',
      delegate,
      initialTabIndex,
    },
  }));
};

export const notify = (gId, handoff) => (d, getState) => {
  let assignees = handoff.get('assignees');
  assignees = assignees || assignees.toJS();

  const currentStepId = getState().getIn(['goals', gId, 'status', 'current_step_id']);
  return d(a.api.request('goals.notify', {
    goal_id: gId,
    flags: handoff.get('flags'),
    message: handoff.get('message'),
    current_step_id: currentStepId,
    assignees,
  }));
};

export const completeStep = (gId, handoff) => (d, getState) => {
  const currentStepId = getState().getIn(['goals', gId, 'status', 'current_step_id']);
  const target = handoff.get('target') === '_complete' ? null : handoff.get('target');

  let assignees = handoff.get('assignees');
  assignees = assignees && assignees.toJS();
  return d(a.api.request('goals.completeStep', {
    goal_id: gId,
    flags: handoff.get('flags'),
    next_step_id: target,
    current_step_id: currentStepId,
    message: handoff.get('message'),
    assignees,
  }));
};


export const attachToGoal = (shareObj, goalId) => (d, getState) => {

};
