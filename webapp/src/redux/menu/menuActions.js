import TabMenu from 'src/react/context-menus/tab-menu/TabMenu';
import Confirmation from 'src/react/context-menus/confirmation/Confirmation';
import InputMenu from 'src/react/context-menus/input-menu/InputMenu';
import * as mainActions from '../main/mainActions';
import * as navigationActions from '../navigation/navigationActions';
import { fromJS } from 'immutable';
import * as cacheActions from 'swipes-core-js/redux/cache/cacheActions';
// import * as cs from 'swipes-core-js/selectors';

export const selectAssignees = (options, assignees, callback) => (
  d,
  getState
) => {
  assignees = assignees || [];

  const state = getState();
  let currentRecent = state.cache.get('recentAssignees') || [];
  if (typeof currentRecent.size !== 'undefined') {
    currentRecent = currentRecent.toJS();
    const disabledUsers =
      state.me.getIn(['organizations', 0, 'disabled_users']) || fromJS([]);
    currentRecent = currentRecent.filter(r => !disabledUsers.contains(r));
  }

  const resultForUser = user => {
    if (!user) {
      return null;
    }
    const obj = {
      id: user.get('id'),
      title: msgGen.users.getFullName(user),
      subtitle: user.get('job_title'),
      rightIcon: {
        button: {
          icon: 'Person'
        }
      }
    };
    if (assignees.indexOf(user.get('id')) !== -1) {
      obj.selected = true;
      obj.rightIcon = {
        button: {
          icon: 'Close'
        }
      };
    }
    const profilePic = msgGen.users.getPhoto(user);
    if (profilePic) {
      obj.leftIcon = {
        src: profilePic
      };
    } else {
      obj.leftIcon = {
        initials: {
          color: 'white',
          backgroundColor: '#000C2F',
          letters: msgGen.users.getInitials(user)
        }
      };
    }
    return obj;
  };

  const resultForUserId = userId => {
    const user = state.users.get(userId);
    return resultForUser(user);
  };

  // const allUsers = () =>
  //   cs.users
  //     .getActive(state)
  //     .map(u => resultForUser(u))
  //     .toArray();

  // const searchForUser = q =>
  //   cs.users.search(state, { searchString: q }).map(res => {
  //     return resultForUserId(res.item.id);
  //   });

  const getRecent = () => currentRecent.map(uId => resultForUserId(uId));
  const getAssignees = () => assignees.map(uId => resultForUserId(uId));

  let tabMenu;
  const recent = [];
  const delegate = {
    onTabMenuLoad: tMenu => {
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
        d(mainActions.contextMenu(null));
      }
      callback(assignees);
      tabMenu.reload();
      // side = [row || left || right]
    },
    resultsForSearch: query => searchForUser(query),
    resultsForTab: tabIndex => {
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
    }
  };
  let initialTabIndex = 2;
  if (currentRecent.length) {
    initialTabIndex = 1;
  }
  if (assignees.length) {
    initialTabIndex = 0;
  }

  d(
    mainActions.contextMenu({
      options,
      component: TabMenu,
      onClose: () => {
        if (recent.length) {
          d(
            cacheActions.save(
              'recentAssignees',
              fromJS([...new Set(recent.concat(currentRecent))])
            )
          );
        }
      },
      props: {
        search: 'Search for name or email',
        delegate,
        initialTabIndex,
        ...options
      }
    })
  );
};

export const confirm = (options, callback) => (d, getState) => {
  const isBrowserSupported = getState().global.get('isBrowserSupported');
  if (!isBrowserSupported) {
    const res = window.confirm(options.message || options.title);
    return callback(res ? 1 : 0);
  }
  d(
    mainActions.contextMenu({
      options,
      component: Confirmation,
      props: {
        title: options.title,
        message: options.message,
        actions: options.actions,
        onClick: i => {
          d(mainActions.contextMenu(null));
          if (callback) {
            callback(i);
          }
        }
      }
    })
  );
};

export const alert = (options, callback) => (d, getState) => {
  const isBrowserSupported = getState().global.get('isBrowserSupported');
  if (!isBrowserSupported) {
    return window.alert(options.message || options.title);
  }
  d(
    mainActions.contextMenu({
      options,
      component: Confirmation,
      props: {
        title: options.title,
        message: options.message,
        actions: options.actions || [{ text: 'Okay' }],
        onClick: i => {
          d(mainActions.contextMenu(null));
          if (callback) {
            callback(i);
          }
        }
      }
    })
  );
};

export const input = (options, callback) => (d, getState) => {
  const isBrowserSupported = getState().global.get('isBrowserSupported');
  if (!isBrowserSupported) {
    const res = window.prompt(options.placeholder, options.text);
    return callback(res);
  }
  d(
    mainActions.contextMenu({
      options,
      component: InputMenu,
      props: {
        ...options,
        onResult: title => {
          d(mainActions.contextMenu(null));
          if (callback) {
            callback(title);
          }
        }
      }
    })
  );
};

export const chooseAttachmentType = options => (d, getState) =>
  new Promise(resolve => {
    const items = [
      {
        id: 'note',
        title: 'New note',
        leftIcon: { icon: 'Note' },
        subtitle: 'Create a note to share more details'
      },
      {
        id: 'url',
        title: 'Add URL',
        leftIcon: { icon: 'Hyperlink' },
        subtitle: 'Share links to useful information from the web'
      },
      {
        id: 'upload',
        title: 'Upload a file',
        leftIcon: { icon: 'File' },
        subtitle: 'Add documents, presentations or photos.'
      }
    ];

    const delegate = {
      onItemAction: item => {
        d(mainActions.contextMenu(null));
        resolve(item);
      }
    };
    d(
      mainActions.contextMenu({
        options,
        component: TabMenu,
        props: {
          ...options,
          delegate,
          items
        }
      })
    );
  });

export const chooseDragAndDrop = (files, options) => (dispatch, getState) =>
  new Promise(resolve => {
    const primary = getState().main.getIn(['dragAndDrop', 'primary']);
    const secondary = getState().main.getIn(['dragAndDrop', 'secondary']);
    const secCardActive = getState().navigation.getIn(['secondary', 'stack'])
      .size;

    const items = [
      primary.size
        ? {
            id: 'primary',
            title: `Attach to: ${primary.get(0).title}`,
            subtitle: secCardActive ? 'Left side' : null,
            leftIcon: { icon: secCardActive ? 'CardLeft' : 'CardSingle' }
          }
        : null,
      secondary.size
        ? {
            id: 'secondary',
            title: `Attach to: ${secondary.get(0).title}`,
            subtitle: 'Right side',
            leftIcon: { icon: 'CardRight' }
          }
        : null,
      {
        id: 'discussion',
        title: 'Start a discussion',
        leftIcon: { icon: 'IconDiscuss' }
      }
    ].filter(i => !!i);

    const delegate = {
      onItemAction: item => {
        dispatch(mainActions.contextMenu(null));
        if (item.id === 'primary') {
          primary.last().handler(files);
        }
        if (item.id === 'secondary') {
          secondary.last().handler(files);
        }
        if (item.id === 'discussion') {
          dispatch(
            navigationActions.set('primary', {
              id: 'Discuss',
              title: 'Discuss'
            })
          );
          dispatch(
            mainActions.modal('primary', {
              component: 'DiscussionComposer',
              title: 'Create a discussion',
              position: 'center'
            })
          );
          setTimeout(() => {
            const lastPrimary = getState()
              .main.getIn(['dragAndDrop', 'primary'])
              .last();
            if (lastPrimary) {
              lastPrimary.handler(files);
            }
          }, 1);
        }
        resolve(item);
      }
    };
    dispatch(
      mainActions.contextMenu({
        options,
        showBackground: true,
        component: TabMenu,
        props: {
          ...options,
          delegate,
          items
        }
      })
    );
  });
