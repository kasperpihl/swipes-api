import { fromJS } from 'immutable';
import * as types from '../constants';

const initialState = fromJS({
  invitationToken: null,
  invitedToTeam: null
});

export default function invitationReducer(state = initialState, action) {
  switch (action.type) {
    case types.INVITATION_SET_TEAM: {
      return initialState.set('invitedToTeam', fromJS(action.payload.team));
    }
    case types.INVITATION_CLEAR: {
      return initialState;
    }
    default:
      return state;
  }
}
