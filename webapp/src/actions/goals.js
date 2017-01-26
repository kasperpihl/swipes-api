import TabMenu from 'src/react/context-menus/tab-menu/TabMenu';
import { List, Map } from 'immutable';
import * as a from './';

export const addToCollection = (goalId, content) => (d, getState) => {
  let attachments = getState().getIn(['goals', goalId, 'attachments']);
  if (!attachments) {
    attachments = Map();
  }
  attachments = attachments.set(content.id, content).toJS();
  let attachmentOrder = getState().getIn(['goals', goalId, 'attachment_order']);
  if (!attachmentOrder) {
    attachmentOrder = List();
  }
  attachmentOrder = attachmentOrder.push(content.id).toJS();

  d(a.api.request('goals.update', {
    goal_id: goalId,
    goal: {
      attachments,
      id: goalId,
      attachment_order: attachmentOrder,
    },
  })).then((res) => {
    console.log('ressy', res);
  });
};

export const archive = goalId => (d) => {
  d(a.modal.load(
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
        d(a.api.request('goals.delete', { goal_id: goalId }));
      }
    },
  ));
};

export const selectStep = (options, goalId, nextStepId, callback) => (d, getState) => {
  const goal = getState().getIn(['goals', goalId]);
  const steps = goal.get('steps');
  const sortedSteps = goal.get('step_order').map(sId => steps.get(sId)).toArray();
  const currentStepId = goal.getIn(['status', 'current_step_id']);
  const resultForStep = (step, i) => {
    let title = `${i + 1}. ${step.get('title')}`;
    if (step.get('id') === currentStepId) {
      title += ' (current)';
    }
    return {
      id: step.get('id'),
      title,
      disabled: (step.get('id') === currentStepId),
      selected: (step.get('id') === nextStepId),
    };
  };
  const delegate = {
    resultsForAll: () => sortedSteps.map((s, i) => resultForStep(s, i)).concat([{
      id: null,
      title: 'Complete Goal',
      selected: !nextStepId,
      rightIcon: {
        icon: 'Checkmark',
      },
    }]),
    onItemAction: (obj) => {
      callback(obj.id);
      d(a.main.contextMenu(null));
    },
  };
  d(a.main.contextMenu({
    options,
    component: TabMenu,
    props: {
      delegate,
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
    onItemAction: (item) => {
      const index = assignees.indexOf(item.id);
      if (index === -1) {
        assignees.push(item.id);
        recent.unshift(item.id);
      } else {
        assignees.splice(index, 1);
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


export const completeStep = (gId, nextSId, message) => (d, getState) => {
  const currentStepId = getState().getIn(['goals', gId, 'status', 'current_step_id']);
  return d(a.api.request('goals.completeStep', {
    goal_id: gId,
    next_step_id: nextSId,
    current_step_id: currentStepId,
    message,
  }));
};
