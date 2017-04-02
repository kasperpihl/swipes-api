const app = nodeRequire('electron').remote.app;
const path = nodeRequire('path');

const sendNotification = (notif) => {
  window.ipcListener.sendEvent('notification', {
    title: 'you have it',
    message: 'you got it',
    icon: path.join(app.getAppPath(), 'icons/logo.png'),
    sound: true, // Only Notification Center or Windows Toasters
    wait: true, // Wait with callback, until user action is taken against notification
  });
};

export default sendNotification;
