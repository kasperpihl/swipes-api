import { fromJS, Map } from 'immutable';

const initialState = fromJS({});

export default function global(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case 'init': {
      return fromJS({
        'sofi': payload.sofi,
      });
    }
    default: {
      return state;
    }
  }
}
