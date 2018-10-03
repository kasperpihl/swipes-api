import * as mainActions from 'src/redux/main/mainActions';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import { fromJS } from 'immutable';
import * as ca from 'swipes-core-js/actions';
import { navForContext } from 'swipes-core-js/classes/utils';
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
    store.subscribe(this.storeChange);
    if (isElectron) {
      remote.getCurrentWindow().removeAllListeners();
      ipcRenderer.on('oauth-success', (event, arg) => {
        store.dispatch(
          ca.me.handleOAuthSuccess(arg.serviceName, arg.queryString)
        );
      });

      // Deal with windows maximize stuff
      const remWin = remote.getCurrentWindow();

      store.dispatch(mainActions.setMaximized(remWin.isMaximized()));
      remWin.on('maximize', () => {
        store.dispatch(mainActions.setMaximized(true));
      });
      remWin.on('toggle-find', () => {
        this.store.dispatch(
          navigationActions.set('primary', {
            id: 'Search',
            title: 'Search',
          })
        );
      });
      remWin.on('clear', () => {
        localForage.clear();
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
  sendNotification(notification) {
    if (!isElectron) {
      return;
    }

    const desktopNotification = new Notification(notification.title, {
      body: notification.message,
      icon: path.join(app.getAppPath(), 'icons/logo.png'),
    });

    desktopNotification.onclick = () => {
      this.store.dispatch(
        navigationActions.openSecondary(
          'primary',
          navForContext(fromJS(notification.target))
        )
      );
      this.store.dispatch(ca.notifications.mark([notification.id]));
      const remWin = remote.getCurrentWindow();
      remWin.focus();
    };
  }
  storeChange() {
    const state = this.store.getState();
    let counter = state.connection.get('notificationCounter') || 0;
    counter += state.counter.get('discussion').size;
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
    if (
      isElectron &&
      (typeof this.badgeCount === 'undefined' || count !== this.badgeCount)
    ) {
      this.badgeCount = count;
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
