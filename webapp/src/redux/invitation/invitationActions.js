import * as types from '../constants';
import request from 'core/utils/request';

export const fetch = invitationToken => dispatch => {
  request('team.inviteReadToken', {
    invitation_token: invitationToken
  }).then(res => {
    if (res.ok) {
      dispatch({
        type: types.INVITATION_SET_TEAM,
        payload: {
          team: res.team
        }
      });
    } else {
      localStorage.removeItem('invitation_token');
      dispatch({ type: types.INVITATION_CLEAR });
    }
  });
};

export const clear = () => {
  localStorage.removeItem('invitation_token');
  return { type: types.INVITATION_CLEAR };
};
