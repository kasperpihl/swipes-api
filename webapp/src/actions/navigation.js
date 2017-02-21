import * as types from 'constants';

export const viewForId = (navId) => {
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
        component: 'Dashboard',
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
    case 'slack':
      return {
        component: 'Slack',
        title: 'Slack',
      };
    case 'store':
      return {
        component: 'Store',
      };
  }
};

export function set(target, navId) {
  return (dispatch, getState) => {
    const payload = {
      id: navId,
      target,
    };
    if (typeof navId === 'string') {
      const state = getState();
      let stack;
      if (target === 'primary') {
        stack = state.getIn(['navigation', 'history', navId]);
      }
      const currentId = state.getIn(['navigation', 'id']);

      if (currentId === navId || !stack) {
        stack = [viewForId(navId)];
      }
      payload.stack = stack;
    } else if (typeof navId === 'object') {
      payload.stack = [navId];
    }
    dispatch({ type: types.NAVIGATION_SET, payload });
  };
}

export function push(target, obj, savedState) {
  const payload = { obj, savedState, target };
  return { type: types.NAVIGATION_PUSH, payload };
}
export function openSecondary(from, obj, savedState) {
  if (from === 'primary') {
    return set('secondary', obj, savedState);
  }
  return push('secondary', obj, savedState);
}

export function pop(target, i) {
  const payload = { target };
  if (typeof i !== 'undefined') {
    payload.index = Math.max(parseInt(i, 10), 0);
  }
  return { type: types.NAVIGATION_POP, payload };
}

export function init() {
  return (dispatch, getState) => {
    const state = getState();
    let navId = state.getIn(['navigation', 'primary', 'id']);
    if (!navId) {
      navId = 'goals';
    }
    if (navId) {
      dispatch(set('primary', navId));
    }
  };
}

export function setCounter(id, counter) {
  return { type: types.NAVIGATION_SET_COUNTER, payload: { id, counter } };
}
