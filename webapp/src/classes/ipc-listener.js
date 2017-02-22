import { me, toasty, main } from 'actions';

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
const toasts = {};

export default class IpcListener {
  constructor(store) {
    this.platform = 'web';
    if (isElectron) {
      this.platform = window.process.platform;
      this.version = window.process.env.npm_package_version;
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
        store.dispatch(main.setFullscreen(true));
      });
      remWin.on('leave-full-screen', () => {
        store.dispatch(main.setFullscreen(false));
      });

      // remWin.close();
      ipcRenderer.on('toasty', (event, arg) => {
        const options = {
          title: arg.filename,
          progress: arg.percentage,
        };

        if (arg.state === 'completed') {
          options.completed = true;
          options.duration = 3000;
        }

        if (toasts[arg.id]) {
          if (arg.state !== 'completed') {
            store.dispatch(toasty.update(toasts[arg.id], options));
          } else {
            setTimeout(() => {
              store.dispatch(toasty.update(toasts[arg.id], options));
              delete toasts[arg.id];
            }, 1000);
          }
        } else {
          store.dispatch(toasty.add(options)).then((toastId) => {
            toasts[arg.id] = toastId;
          });
        }
      });
    }
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
