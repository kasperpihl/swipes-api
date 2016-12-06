import * as types from 'constants';

const defaultHistoryForProfile = () => [{
  component: 'Profile',
  title: 'Profile',
}];

const defaultHistoryForOrgName = orgName => [{
  component: 'OrgDashboard',
  title: orgName,
}, {
  component: 'GoalList',
  title: 'Goals',
}];

export function navigateToId(navId) {
  return (dispatch, getState) => {
    if (navId) {
      const payload = {
        id: navId,
      };
      const state = getState();
      let history = state.getIn(['navigation', 'history', navId]);
      if (!history) {
        history = defaultHistoryForProfile();
        const org = state.getIn(['me', 'organizations']).find(o => o.get('id') === navId);
        if (org) {
          history = defaultHistoryForOrgName(org.get('name'));
        }
        payload.history = history;
      }
      dispatch({ type: types.NAVIGATION_SET, payload });
    }
  };
}

export function init() {
  return (dispatch, getState) => {
    const state = getState();
    let navId = state.getIn(['navigation', 'currentId']);
    const me = state.get('me');
    if (!navId && me) {
      navId = me.getIn(['organizations', 0, 'id']);
    }
    if (navId) {
      dispatch(navigateToId(navId));
    }
  };
}

export function push(obj) {
  const payload = { obj };
  return { type: types.NAVIGATION_PUSH, payload };
}
export function pop() {
  return { type: types.NAVIGATION_POP };
}
export function popTo(i) {
  const payload = {
    index: i,
  };
  return { type: types.NAVIGATION_POP, payload };
}
export function popToRoot() {

}
