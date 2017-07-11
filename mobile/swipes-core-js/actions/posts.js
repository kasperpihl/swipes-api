import * as ca from './';

// ======================================================
// Create post
// ======================================================

export const create = payload => (dp, getState) => dp(ca.api.request('posts.create', {
  organization_id: getState().getIn(['me', 'organizations', 0, 'id']),
  ...payload,
}));

export const addComment = payload => (dp, getState) => dp(ca.api.request('posts.addComment', {
  ...payload,
}));
