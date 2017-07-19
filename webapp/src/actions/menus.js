import TabMenu from 'src/react/context-menus/tab-menu/TabMenu';
import Confirmation from 'src/react/context-menus/confirmation/Confirmation';
import InputMenu from 'src/react/context-menus/input-menu/InputMenu';
import * as a from './';

export const confirm = (options, callback) => (d) => {
  d(a.main.contextMenu({
    options,
    component: Confirmation,
    props: {
      title: options.title,
      message: options.message,
      actions: options.actions,
      onClick: (i) => {
        d(a.main.contextMenu(null));
        if (callback) {
          callback(i);
        }
      },
    },
  }));
};

export const input = (options, callback) => (d) => {
  d(a.main.contextMenu({
    options,
    component: InputMenu,
    props: {
      ...options,
      onResult: (title) => {
        d(a.main.contextMenu(null));
        if (callback) {
          callback(title);
        }
      },
    },
  }));
};

export const selectGoalType = (options, callback) => (d) => {
  const delegate = {
    onItemAction: (item) => {
      d(a.main.contextMenu(null));
      callback(item);
    },
    resultsForAll: () => [
      { id: null, title: 'All goals' },
      { id: 'completed', title: 'Completed goals' },
      { id: 'current', title: 'Current goals' },
      { id: 'starred', title: 'Starred goals' },
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
      title: msgGen.users.getFullName(id),
      subtitle,
    };
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

  const sortedUsers = users => users.sort(
    (b, c) => {
      if (b.get('id') === me.get('id')) {
        return -1;
      }
      if (c.get('id') === me.get('id')) {
        return 1;
      }
      return msgGen.users.getFirstName(b).localeCompare(msgGen.users.getFirstName(c));
    },
  ).toArray();

  const allUsers = () => [
    { id: null, title: 'Any one assigned' },
    { id: 'none', title: 'No one assigned' },
  ].concat(sortedUsers(state.get('users')).map(u => resultForUser(u)));

  const searchForUser = q => sortedUsers(state.get('users')).map((u) => {
    if (
      msgGen.users.getFirstName(u).toLowerCase().startsWith(q.toLowerCase()) ||
      msgGen.users.getLastName(u).toLowerCase().startsWith(q.toLowerCase())
    ) {
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

export const selectMilestone = (options, callback) => (d, getState) => {

  const state = getState();
  const milestones = state.get('milestones');

  const resultForMilestone = (milestone) => {
    const obj = {
      id: milestone.get('id'),
      title: msgGen.milestones.getName(milestone),
      selected: options.selectedId === milestone.get('id'),
    };
    return obj;
  };

  const sortedMilestones = () => milestones.sort((m1, m2) => {
    return msgGen.users.getFirstName(m1).localeCompare(msgGen.users.getFirstName(m2));
  }).toArray();

  const defItems = [];
  if(!options.disableAny){
    defItems.push({ id: null, title: 'Any milestone' });
  }
  defItems.push({ id: 'none', title: 'No milestone' });
  const allMilestones = () => defItems.concat(sortedMilestones().map(m => resultForMilestone(m)));

  const searchForMilestone = q => sortedMilestones().filter((m) => {
    return (msgGen.milestones.getName(m).toLowerCase().startsWith(q.toLowerCase()))
  }).map(m => resultForMilestone(m));

  const delegate = {
    onItemAction: (item) => {
      callback(item);
      d(a.main.contextMenu(null));
    },
    resultsForAll: () => allMilestones(),
    resultsForSearch: query => searchForMilestone(query),
  };
  d(a.main.contextMenu({
    options,
    component: TabMenu,
    props: {
      search: 'Search for milestone',
      delegate,
    },
  }));
};

export const chooseAttachmentType = (options) => (d, getState) => new Promise((resolve) => {
  const items = [
    { id: 'note', title: 'New Note', leftIcon: { icon: 'Note' }},
    { id: 'url', title: 'Add URL', leftIcon: { icon: 'Hyperlink' }},
    { id: 'upload', title: 'Upload file', leftIcon: { icon: 'File' }},
  ];

  const delegate = {
    onItemAction: (item) => {
      d(a.main.contextMenu(null));
      resolve(item);
    },
  };
  d(a.main.contextMenu({
    options,
    component: TabMenu,
    props: {
      delegate,
      items,
    },
  }));
})
