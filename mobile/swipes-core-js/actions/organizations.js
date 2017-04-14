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
