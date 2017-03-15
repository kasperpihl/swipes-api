import { fromJS, Map } from 'immutable';

const initialState = fromJS({});

export default function main(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case 'rtm.start': {
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
      return state.set(payload.way.id, fromJS(payload.way));
    }
    case 'way_archived':
    case 'ways.archive': {
      return state.delete(payload.id);
    }
    default:
      return state;
  }
}
