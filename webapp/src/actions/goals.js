import TabMenu from 'src/react/context-menus/tab-menu/TabMenu';
import SelectStep from 'src/react/context-menus/select-step/SelectStep';
import { List, Map } from 'immutable';
import GoalsUtil from 'classes/goals-util';
import * as a from './';

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
  return d(a.api.request('goals.update', {
    goal_id: goalId,
    goal,
  }));
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

  return d(a.api.request('goals.update', {
    goal_id: goalId,
    goal: {
      attachments,
      id: goalId,
      attachment_order: attachmentOrder,
    },
  }));
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
    callback(id);
    d(a.main.contextMenu(null));
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
      title: user.get('name'),
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
          letters: user.get('name').slice(0, 1),
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
    (b, c) => b.get('name').localeCompare(c.get('name')),
  ).toArray();

  const allUsers = () => sortedUsers(state.get('users')).map(u => resultForUser(u));

  const searchForUser = q => sortedUsers(state.get('users')).map((u) => {
    if (u.get('name').toLowerCase().startsWith(q.toLowerCase())) {
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


export const completeStep = (gId, nextSId, message, flags) => (d, getState) => {
  const currentStepId = getState().getIn(['goals', gId, 'status', 'current_step_id']);
  return d(a.api.request('goals.completeStep', {
    goal_id: gId,
    flags,
    next_step_id: nextSId,
    current_step_id: currentStepId,
    message,
  }));
};
