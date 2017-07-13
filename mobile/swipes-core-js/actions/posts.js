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

export const addReaction = payload => (dp, getState) => dp(ca.api.request('posts.addReaction', {
  ...payload,
}));

export const removeReaction = payload => (dp, getState) => dp(ca.api.request('posts.removeReaction', {
  ...payload,
}));

export const commentAddReaction = payload => (dp, getState) => dp(ca.api.request('posts.commentAddReaction', {
  ...payload,
}));

export const commentRemoveReaction = payload => (dp, getState) => dp(ca.api.request('posts.commentRemoveReaction', {
  ...payload,
}));
