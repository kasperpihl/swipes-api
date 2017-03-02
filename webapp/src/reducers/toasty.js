import { OrderedMap, Map } from 'immutable';
import * as types from 'constants';

const initialState = OrderedMap();

export default function toasty(state = initialState, action) {
  switch (action.type) {
    case types.TOAST_ADD: {
      const { toast, toastId } = action;
      return state.set(toastId, Map(toast));
    }
    case types.TOAST_UPDATE: {
      const { toast, toastId } = action;
      return state.mergeIn([toastId], Map(toast));
    }
    case types.TOAST_REMOVE: {
      const { toastId } = action;
      return state.delete(toastId);
    }
    default:
      return state;
  }
}
