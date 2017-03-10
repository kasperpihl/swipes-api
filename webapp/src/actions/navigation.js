import * as types from 'constants';
import { randomString } from 'classes/utils';

export function set(target, obj) {
  return (dispatch) => {
    const payload = {
      id: target === 'primary' ? obj.id : randomString(5),
      target,
      stack: obj ? [obj] : [],
    };
    dispatch({ type: types.NAVIGATION_SET, payload });
  };
}

export function saveState(target, savedState) {
  const payload = { savedState, target };
  return { type: types.NAVIGATION_SAVE_STATE, payload };
}

export function push(target, obj) {
  const payload = { obj, target };
  return { type: types.NAVIGATION_PUSH, payload };
}
export function openSecondary(from, obj) {
  if (from === 'primary') {
    return set('secondary', obj);
  }
  return push('secondary', obj);
}

export function pop(target, i) {
  const payload = { target };
  if (typeof i !== 'undefined') {
    payload.index = Math.max(parseInt(i, 10), 0);
  }
  return { type: types.NAVIGATION_POP, payload };
}

export const setCounter = (id, counter) => (d, getState) => {
  // window.ipcListener.setBadgeCount(counter);

  d({ type: types.NAVIGATION_SET_COUNTER, payload: { id, counter } }).then(() => {
    if (window.ipcListener) {
      const counters = getState().getIn(['navigation', 'counters']);
      const slackCount = counters.get('Slack');
      const swipesCount = counters.get('Dashboard');
      if (swipesCount || slackCount) {
        let totalCount = 0;
        if (swipesCount && swipesCount.length) {
          totalCount += parseInt(swipesCount, 10);
        }
        if (slackCount && slackCount.length && slackCount !== '•') {
          totalCount += parseInt(slackCount, 10);
        }
        if (!totalCount && slackCount === '•') {
          totalCount = slackCount;
        }
        window.ipcListener.setBadgeCount(`${totalCount}`);
      }
    }
  });
};
