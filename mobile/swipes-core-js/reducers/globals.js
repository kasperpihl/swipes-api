import { fromJS, Map } from 'immutable';

const initialState = fromJS({});

export default function globals(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    default: {
      return state;
    }
  }
}
