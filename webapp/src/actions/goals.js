import TabMenu from 'context-menus/tab-menu/TabMenu';
import { fromJS, List } from 'immutable';
import { cache } from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';
import * as a from './';

export const selectAssignees = (options, assignees, callback) => (d, getState) => {
  assignees = assignees || [];

  const state = getState();
  let currentRecent = state.getIn(['cache', 'recentAssignees']) || [];
  if (typeof currentRecent.size !== 'undefined') {
    currentRecent = currentRecent.toJS();
    const disabledUsers = state.getIn(['me', 'organizations', 0, 'disabled_users']);
    currentRecent = currentRecent.filter(r => !disabledUsers.contains(r));
  }

  const resultForUser = (user) => {
    if (!user) {
      return null;
    }
    const obj = {
      id: user.get('id'),
      title: msgGen.users.getFullName(user),
      subtitle: user.get('job_title'),
      rightIcon: {
        button: {
          icon: 'Person',
        },
      },
    };
    if (assignees.indexOf(user.get('id')) !== -1) {
      obj.selected = true;
      obj.rightIcon = {
        button: {
          icon: 'Close',
        },
      };
    }
    const profilePic = msgGen.users.getPhoto(user);
    if (profilePic) {
      obj.leftIcon = {
        src: profilePic,
      };
    } else {
      obj.leftIcon = {
        initials: {
          color: 'white',
          backgroundColor: '#000C2F',
          letters: msgGen.users.getInitials(user),
        },
      };
    }
    return obj;
  };

  const resultForUserId = (userId) => {
    const user = state.getIn(['users', userId]);
    return resultForUser(user);
  };

  const allUsers = () => cs.users.getActive(state).map(u => resultForUser(u)).toArray();

  const searchForUser = q => cs.users.search(state, {searchString:  q}).map((res) => {
    return resultForUserId(res.item);
  });

  const getRecent = () => currentRecent.map(uId => resultForUserId(uId));
  const getAssignees = () => assignees.map(uId => resultForUserId(uId));

  let tabMenu;
  const recent = [];
  const delegate = {
    onTabMenuLoad: (tMenu) => {
      tabMenu = tMenu;
    },
    onActionClick: () => {
      callback();
    },
    getNumberOfTabs: () => 3,
    getNameForTab: i => [`Assigned (${assignees.length})`, 'Recent', 'All'][i],
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
        d(cache.save('recentAssignees', fromJS([...new Set(recent.concat(currentRecent))])));
      }
    },
    props: {
      search: 'Search for name or email',
      delegate,
      initialTabIndex,
      ...options,
    },
  }));
};
