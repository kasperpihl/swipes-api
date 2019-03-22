import { fromJS } from 'immutable';
import * as types from '../constants';

const initialState = fromJS({
  invitationToken: null,
  invitedToOrg: null
});

export default function invitationReducer(state = initialState, action) {
  switch (action.type) {
    case types.INVITATION_SET_ORGANIZATION: {
      return initialState.set('invitedToOrg', fromJS(action.payload.org));
    }
    case types.INVITATION_CLEAR: {
      return initialState;
    }
    default:
      return state;
  }
}
