import * as a from './';

export const invite = (firstName, email) => (d, getState) => d(a.api.request('users.invite', {
  first_name: firstName,
  email,
  organization_id: getState().getIn(['me', 'organizations', 0, 'id']),
}));
