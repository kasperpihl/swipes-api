import * as ca from './';

// ======================================================
export const create = (name) => ca.api.request('organizations.create', {
  organization_name: name,
});

export const join = (orgId) => ca.api.request('organizations.join', {
  organization_id: orgId,
});

export const leave = (orgId) => ca.api.request('organizations.leave', {
  organization_id: orgId,
});

export const promoteToAdmin = (orgId, userId) => ca.api.request('organizations.promoteToAdmin', {
  organization_id: orgId,
  user_to_promote_id: userId,
});

export const demoteAnAdmin = (orgId, userId) => ca.api.request('organizations.demoteAnAdmin', {
  organization_id: orgId,
  user_to_demote_id: userId,
});

export const enableUser = (orgId, userId) => ca.api.request('organizations.enableUser', {
  organization_id: orgId,
  user_to_enable_id: userId,
});

export const disableUser = (orgId, userId) => ca.api.request('organizations.disableUser', {
  organization_id: orgId,
  user_to_disable_id: userId,
});

export const createStripeCustomer = (token, plan) => (d, getState) => d(ca.api.request('organizations.createStripeCustomer', {
  organization_id: getState().getIn(['me', 'organizations', 0, 'id']),
  stripe_token: token,
  plan,
}));
