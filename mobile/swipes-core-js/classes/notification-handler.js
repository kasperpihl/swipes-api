import { fromJS } from 'immutable';
/* global msgGen */

const handleNotification = (notification) => {
  if (window.ipcListener) {
    if (!notification.request && !notification.notification) {
      return;
    }
    const n = fromJS(notification);
    const notif = {
      title: msgGen.notifications.getTitle(n),
      message: msgGen.notifications.getMessage(n),
    };
    window.ipcListener.sendNotification(notif);
  }
};

export default handleNotification;
