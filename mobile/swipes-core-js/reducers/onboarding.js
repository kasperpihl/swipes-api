import * as types from 'constants'
import { fromJS, Map } from 'immutable'
const initialState = fromJS({});

export default function onboarding (state = initialState, action) {
  const { payload, type } = action;
  switch (action.type) {
    case 'init': {
      let onboarding = Map();
      payload.onboarding.forEach((o) => {
        onboarding = onboarding.set(o.id, fromJS(o));
      });
      return onboarding;
    }
    default:
      return state
  }
}
