import * as a from 'actions';

// ======================================================
// Mark notifications as read
// ======================================================
export const mark = payload => dp => dp(a.api.request('notifications.markAsSeen', {
  notification_ids: payload,
}));
