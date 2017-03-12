import { fromJS, Map } from 'immutable';

const initialState = fromJS({});

export default function main(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case 'rtm.start': {
      if (!payload.ok) {
        return state;
      }
      let ways = Map();
      payload.ways.forEach((w) => {
        ways = ways.set(w.id, fromJS(w));
      });
      return ways;
    }


    // ======================================================
    // Ways
    // ======================================================
    case 'way_created':
    case 'ways.create': {
      if (payload.ok || typeof payload.ok === 'undefined') {
        return state.set(payload.way.id, fromJS(payload.way));
      }
      return state;
    }
    case 'way_archived':
    case 'ways.archive': {
      if (payload.ok || typeof payload.ok === 'undefined') {
        return state.delete(payload.id);
      }
      return state;
    }
    default:
      return state;
  }
}
