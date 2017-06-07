import { fromJS, Map } from 'immutable';
import { reducerInitToMap } from '../classes/utils';

const initialState = fromJS({});

export default function main(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case 'init': {
      return reducerInitToMap(payload, 'services', state);
    }

    default:
      return state;
  }
}
