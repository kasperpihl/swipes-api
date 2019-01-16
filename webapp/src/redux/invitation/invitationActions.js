import * as types from '../constants';
import request from 'swipes-core-js/utils/request';

export const fetch = invitationToken => dispatch => {
  request('organization.readInvitationToken', {
    invitation_token: invitationToken
  }).then(res => {
    if (res.ok) {
      dispatch({
        type: types.INVITATION_SET_ORGANIZATION,
        payload: {
          organization: res.organization
        }
      });
    } else {
      localStorage.removeItem('invitation_token');
      dispatch({ type: types.INVITATION_DECLINE });
    }
  });
};
