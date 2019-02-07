import * as mainActions from 'src/redux/main/mainActions';

import userGetFirstName from 'swipes-core-js/utils/user/userGetFirstName';

/* global nodeRequire*/
const isElectron = window.process && window.process.versions.electron;
let ipcRenderer;
let dialog;
let app;
let remote;
let os;
let path;
if (isElectron) {
  ipcRenderer = nodeRequire('electron').ipcRenderer;
  remote = nodeRequire('electron').remote;
  app = remote.app;
  dialog = remote.dialog;
  path = nodeRequire('path');
  os = nodeRequire('os');
}

export default class IpcListener {
  constructor(store) {
    this.store = store;
    store.subscribe(this.storeChange.bind(this));
    if (isElectron) {
      remote.getCurrentWindow().removeAllListeners();
      ipcRenderer.on('oauth-success', (event, arg) => {
        // store.dispatch(
        //   ca.me.handleOAuthSuccess(arg.serviceName, arg.queryString)
        // );
      });

      // Deal with windows maximize stuff
      const remWin = remote.getCurrentWindow();

      store.dispatch(mainActions.setMaximized(remWin.isMaximized()));
      remWin.on('maximize', () => {
        store.dispatch(mainActions.setMaximized(true));
      });
      remWin.on('clear', () => {
        localStorage.clear();
      });
      remWin.on('unmaximize', () => {
        store.dispatch(mainActions.setMaximized(false));
      });

      // Deal with fullScreen
      store.dispatch(mainActions.setFullscreen(remWin.isFullScreen()));
      remWin.on('enter-full-screen', () => {
        store.dispatch(mainActions.setMaximized(remWin.isMaximized()));
        store.dispatch(mainActions.setFullscreen(remWin.isFullScreen()));
      });
      remWin.on('leave-full-screen', () => {
        store.dispatch(mainActions.setMaximized(remWin.isMaximized()));
        store.dispatch(mainActions.setFullscreen(remWin.isFullScreen()));
      });
    }
  }
  handleDesktopNotifications(payload) {
    const myId = this.store.getState().me.get('user_id');
    let discussion;
    let comment;
    payload.updates.forEach(({ type, data }) => {
      if (
        type === 'comment' &&
        data.sent_by !== myId &&
        data.sent_by !== 'USOFI' &&
        data.sent_at === data.updated_at
      ) {
        comment = data;
      } else if (type === 'discussion') {
        discussion = data;
      }
    });
    // Make sure discussion and comment belong together
    if (
      discussion &&
      comment &&
      discussion.discussion_id === comment.discussion_id
    ) {
      // Ensure I'm following the discussion.
      if (
        !discussion.followers.filter(({ user_id }) => user_id === myId).length
      ) {
        return;
      }

      const strippedMessage = comment.message.replace(
        /<![A-Z0-9]*\|(.*?)>/gi,
        (full, name) => name
      );
      this.sendNotification({
        id: comment.id,
        target: {
          id: comment.discussion_id
        },
        title: discussion.topic,
        message: `${userGetFirstName(comment.sent_by)}: ${strippedMessage}`
      });
    }
  }
  sendNotification(notification) {
    if (!isElectron) {
      return;
    }

    const desktopNotification = new Notification(notification.title, {
      body: notification.message,
      icon: path.join(app.getAppPath(), 'icons/logo.png')
    });

    // desktopNotification.onclick = () => {
    //   this.store.dispatch(
    //     navigationActions.openSecondary(
    //       'primary',
    //       navForContext(fromJS(notification.target))
    //     )
    //   );
    //   const remWin = remote.getCurrentWindow();
    //   remWin.focus();
    // };
  }
  storeChange() {
    const state = this.store.getState();
    const counter = state.connection.get('unread').size;
    if (typeof this.badgeCount === 'undefined' || counter !== this.badgeCount) {
      this.badgeCount = counter;
      this.setBadgeCount(`${counter || ''}`);
    }
  }
  preloadUrl(script) {
    if (!isElectron) {
      return script;
    }
    let preloadUrl = `file://${path.join(
      app.getAppPath(),
      `preload/${script}.js`
    )}`;
    if (os.platform() === 'win32') {
      preloadUrl = path.resolve(`preload/${script}.js`);
    }
    return preloadUrl;
  }
  setBadgeCount(count) {
    if (isElectron) {
      if (typeof count === 'number') {
        app.setBadgeCount(count);
      }
      if (typeof count === 'string' && app.dock) {
        app.dock.setBadge(count);
      }
    }
  }
  unFullscreen() {
    if (isElectron) {
      const remWin = remote.getCurrentWindow();
      remWin.setFullScreen(false);
    }
  }
  unmaximize() {
    if (isElectron) {
      const remWin = remote.getCurrentWindow();
      remWin.unmaximize();
    }
  }
  maximize() {
    if (isElectron) {
      const remWin = remote.getCurrentWindow();
      remWin.maximize();
    }
  }
  minimize() {
    if (isElectron) {
      const remWin = remote.getCurrentWindow();
      remWin.minimize();
    }
  }
  close() {
    if (isElectron) {
      const remWin = remote.getCurrentWindow();
      remWin.close();
    }
  }
  reload() {
    if (isElectron) {
      this.sendEvent('reload');
    } else {
      window.location.reload();
    }
  }
  openDialog(options) {
    if (isElectron) {
      dialog.showOpenDialog(options);
    }
  }
  sendEvent(name, data) {
    if (!isElectron) {
      return undefined;
    }
    let functionName = 'send';
    if (name === 'showItemInFolder') {
      functionName = 'sendSync';
    }
    return ipcRenderer[functionName](name, data);
  }
}
