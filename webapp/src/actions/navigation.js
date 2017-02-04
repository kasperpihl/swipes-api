import * as types from 'constants';

const startingViewForNavId = (navId) => {
  switch (navId) {
    case 'goals':
    default:
      return {
        component: 'GoalList',
        title: 'Goals',
      };
    case 'milestones': {
      return {
        component: 'MilestoneList',
        title: 'Milestones (In Progress)',
      };
    }
    case 'dashboard':
      return {
        component: 'OrgDashboard',
        title: 'Dashboard',
      };
    case 'find':
      return {
        component: 'Find',
        title: 'Find',
        placeholder: 'Search across Dropbox, Asana, Slack...',
      };
    case 'profile':
      return {
        component: 'Profile',
        title: 'Profile',
      };
    case 'browser':
      return {
        component: 'Browser',
        title: 'Browser',
        fullscreen: true,
        props: {
          url: 'https://paper.dropbox.com',
        },
      };
    case 'store':
      return {
        component: 'Store',
        fullscreen: true,
      };
  }
};

export function navigateToId(target, navId) {
  return (dispatch, getState) => {
    const payload = {
      id: navId,
      target,
    };
    if (navId) {
      const state = getState();
      let history = state.getIn(['navigation', target, 'history', navId]);
      const currentId = state.getIn(['navigation', target, 'id']);

      if (currentId === navId || !history) {
        history = [startingViewForNavId(navId)];
        payload.history = history;
      }
    }
    dispatch({ type: types.NAVIGATION_SET, payload });
  };
}

export function init() {
  return (dispatch, getState) => {
    const state = getState();
    let navId = state.getIn(['navigation', 'primary', 'id']);
    if (!navId) {
      navId = 'goals';
    }
    if (navId) {
      dispatch(navigateToId('primary', navId));
    }
  };
}
export function setCounter(id, counter) {
  return { type: types.NAVIGATION_SET_COUNTER, payload: { id, counter } };
}

export function push(target, obj, savedState) {
  const payload = { obj, savedState, target };
  return { type: types.NAVIGATION_PUSH, payload };
}
export function pop(target) {
  return { type: types.NAVIGATION_POP, payload: { target } };
}
export function popTo(target, i) {
  i = Math.max(parseInt(i, 10), 0); // Don't allow removing root

  const payload = {
    index: i,
    target,
  };
  return { type: types.NAVIGATION_POP, payload };
}
