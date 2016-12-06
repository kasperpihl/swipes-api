import { fromJS } from 'immutable';
import * as types from 'constants';

const initialState = fromJS({});

export default function workflows(state = initialState, action) {
  switch (action.type) {
    case 'rtm.start': {
      const { processes } = action.payload;

      if (!processes) return state;
      const tempW = {};

      processes.forEach((process) => {
        tempW[process.id] = process;
      });

      return fromJS(tempW);
    }
    case types.LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
