import * as ca from './';

// ======================================================
export const promoteToAdmin = (orgId, userId) => ca.api.request('organizations.promoteToAdmin', {
  organization_id: orgId,
  user_to_promote_id: userId,
});

export const demoteAnAdmin = (orgId, userId) => ca.api.request('organizations.demoteAnAdmin', {
  organization_id: orgId,
  user_to_demote_id: userId,
});

export const createStripeCustomer = (token) => (d, getState) => d(ca.api.request('organizations.createStripeCustomer', {
  organization_id: getState().getIn(['me', 'organizations', 0, 'id']),
  stripe_token: token,
}));
