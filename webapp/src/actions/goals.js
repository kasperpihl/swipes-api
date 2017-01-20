import { List } from 'immutable';
import { request } from './api';
import { load } from './modal';
import * as a from './';
import TabMenu from 'src/react/context-menus/tab-menu/TabMenu';

export const addToCollection = (goalId, content) => (dispatch, getState) => {
  let collection = getState().getIn(['goals', goalId, 'collection']);
  if (!collection) {
    collection = List();
  }
  collection = collection.push(content).toJS();
  dispatch(request('goals.update', {
    goal_id: goalId,
    goal: { collection, id: goalId },
  })).then((res) => {
    console.log('ressy', res);
  });
};

export const archive = goalId => (dispatch) => {
  dispatch(load(
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
        dispatch(request('goals.delete', { goal_id: goalId }));
      }
    },
  ));
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


export const submitStep = (gId, sId, message, pSteps) => dispatch => new Promise((resolve) => {
  let modalOpt;
  if (pSteps) {
    modalOpt = {
      title: 'Go back to step',
      data: {
        list: {
          selectable: true,
          items: pSteps.map((step, i) => {
            const title = `${i + 1}. ${step.get('title')}`;
            const selected = (i === 0);
            return { title, selected, id: step.get('id') };
          }).toJS(),
        },
        buttons: ['Submit'],
      },
    };
  }
  const submit = (stepBackId) => {
    dispatch(request('steps.submit', {
      goal_id: gId,
      step_id: sId,
      step_back_id: stepBackId,
      message,
    })).then((resMom, err) => {
      resolve(!err);
      if (err) {
          // return console.log('Error completing step', err);
      }
    });
  };
  if (modalOpt) {
    dispatch(load(modalOpt, (res) => {
      if (res) {
        let stepBackId;
        if (pSteps) {
          const index = res.items.length ? res.items[0] : 0;
          stepBackId = pSteps.get(index).get('id');
        }
        submit(stepBackId);
      } else {
        resolve();
      }
    }));
  } else {
    submit();
  }
});
