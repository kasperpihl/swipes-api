import * as types from 'constants';
const additionalViewsForOptions = (navId, options) => {
  if (navId === 'goals' && options) {
    return [
      {
        component: 'GoalStep',
        title: options.title,
        props: {
          goalId: options.goalId,
        },
      },
    ];
  }
  return [];
};
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
        title: 'Milestones',
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

export function navigateToId(navId, options) {
  return (dispatch, getState) => {
    if (navId) {
      const payload = {
        id: navId,
      };
      const state = getState();
      let history = state.getIn(['navigation', 'history', navId]);
      const currentId = state.getIn(['navigation', 'id']);

      if (currentId === navId || !history) {
        history = [startingViewForNavId(navId, options)];
        payload.history = history;
      }

      dispatch({ type: types.NAVIGATION_SET, payload });
    }
  };
}

export function init() {
  return (dispatch, getState) => {
    const state = getState();
    let navId = state.getIn(['navigation', 'id']);
    const me = state.get('me');
    if (!navId && me) {
      navId = 'goals';
    }
    if (navId) {
      dispatch(navigateToId(navId));
    }
  };
}
export function setCounter(id, counter) {
  return { type: types.NAVIGATION_SET_COUNTER, payload: { id, counter } };
}

export function push(obj, savedState) {
  const payload = { obj, savedState };
  return { type: types.NAVIGATION_PUSH, payload };
}
export function pop() {
  return { type: types.NAVIGATION_POP };
}
export function popTo(i) {
  i = Math.max(parseInt(i, 10), 0); // Don't allow removing root

  const payload = {
    index: i,
  };
  return { type: types.NAVIGATION_POP, payload };
}
export function popToRoot() {

}
