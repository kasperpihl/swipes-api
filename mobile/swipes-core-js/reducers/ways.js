import { fromJS, Map } from 'immutable';
import { reducerInitToMap } from '../classes/utils';

const initialState = fromJS({});

export default function waysReducer(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case 'init': {
      return reducerInitToMap(payload, 'ways', state);
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
