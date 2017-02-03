import TabMenu from 'src/react/context-menus/tab-menu/TabMenu';
import * as a from './';

export const selectGoalType = (options, callback) => (d) => {
  const delegate = {
    onItemAction: (item) => {
      callback(item);
      d(a.main.contextMenu(null));
    },
    resultsForAll: () => [
      { id: 'all', title: 'All goals' },
      { id: 'completed', title: 'Completed goals' },
      { id: 'current', title: 'Current goals' },
      { id: 'upcoming', title: 'Upcoming goals' },
    ],
  };

  d(a.main.contextMenu({
    options,
    component: TabMenu,
    props: {
      delegate,
    },
  }));
};

export const selectUser = (options, callback) => (d, getState) => {
  const state = getState();
  const me = state.get('me');

  const resultForUser = (user) => {
    if (!user) {
      return null;
    }
    const isMe = me.get('id') === user.get('id');
    const subtitle = isMe ? 'You' : user.get('job_title');
    const id = isMe ? 'me' : user.get('id');
    const obj = {
      id,
      title: user.get('name'),
      subtitle,
    };
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

  const sortedUsers = users => users.sort(
    (b, c) => {
      if (b.get('id') === me.get('id')) {
        return -1;
      }
      if (c.get('id') === me.get('id')) {
        return 1;
      }
      return b.get('name').localeCompare(c.get('name'));
    },
  ).toArray();

  const allUsers = () => [
    { id: 'any', title: 'Any one assigned' },
    { id: 'none', title: 'No one assigned' },
  ].concat(sortedUsers(state.get('users')).map(u => resultForUser(u)));

  const searchForUser = q => sortedUsers(state.get('users')).map((u) => {
    if (u.get('name').toLowerCase().startsWith(q.toLowerCase())) {
      return resultForUser(u);
    }
    return null;
  }).filter(v => !!v);

  const delegate = {
    onItemAction: (item) => {
      callback(item);
      d(a.main.contextMenu(null));
    },
    resultsForAll: () => allUsers(),
    resultsForSearch: query => searchForUser(query),
  };

  d(a.main.contextMenu({
    options,
    component: TabMenu,
    props: {
      search: 'Search for name',
      delegate,
    },
  }));
};
