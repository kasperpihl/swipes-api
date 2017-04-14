import * as ca from './';

// ======================================================
// Mark notifications as read
// ======================================================
export const mark = payload => dp => dp(ca.api.request('notifications.markAsSeen', {
  notification_ids: payload,
}));
