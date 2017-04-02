import { main } from 'actions';
import { me } from 'swipes-core-js/actions';
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
    this.platform = 'web';
    window.getHeaders = this.getHeaders.bind(this);
    if (isElectron) {
      remote.getCurrentWindow().removeAllListeners();
      this.isElectron = true;
      this.platform = window.process.platform;
      this.version = remote.getGlobal('version');
      this.arch = window.process.arch;
      ipcRenderer.on('oauth-success', (event, arg) => {
        store.dispatch(me.handleOAuthSuccess(arg.serviceName, arg.queryString));
      });
      ipcRenderer.on('alert-message', (event, arg) => {
        alert(arg.message);
      });

      // Deal with windows maximize stuff
      const remWin = remote.getCurrentWindow();

      store.dispatch(main.setMaximized(remWin.isMaximized()));
      remWin.on('maximize', () => {
        store.dispatch(main.setMaximized(true));
      });
      remWin.on('unmaximize', () => {
        store.dispatch(main.setMaximized(false));
      });

      // Deal with fullScreen
      store.dispatch(main.setFullscreen(remWin.isFullScreen()));
      remWin.on('enter-full-screen', () => {
        store.dispatch(main.setMaximized(remWin.isMaximized()));
        store.dispatch(main.setFullscreen(remWin.isFullScreen()));
      });
      remWin.on('leave-full-screen', () => {
        store.dispatch(main.setMaximized(remWin.isMaximized()));
        store.dispatch(main.setFullscreen(remWin.isFullScreen()));
      });
    }
  }
  sendNotification(notification) {
    if (!isElectron) {
      return;
    }
    console.log(notification);
    this.sendEvent('notification', Object.assign({
      icon: path.join(app.getAppPath(), 'icons/logo.png'),
      wait: true,
      sound: true,
    }, notification));
  }
  getHeaders() {
    return {
      'sw-web-version': window.__VERSION__,
      'sw-electron-version': this.version,
      'sw-electron-arch': this.arch,
      'sw-platform': this.platform,
    };
  }
  preloadUrl(script) {
    if (!isElectron) {
      return script;
    }
    let preloadUrl = `file://${path.join(app.getAppPath(), `preload/${script}.js`)}`;
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
