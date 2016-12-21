import { me, toasty } from 'actions';

/* global nodeRequire*/
const isElectron = window.process && window.process.versions.electron;
let ipcRenderer,
  dialog;
if (isElectron) {
  ipcRenderer = nodeRequire('electron').ipcRenderer;
  dialog = nodeRequire('electron').remote.dialog;
}
const toasts = {};

export default class IpcListener {
  constructor(store) {
    if (isElectron) {
      ipcRenderer.on('oauth-success', (event, arg) => {
        store.dispatch(me.handleOAuthSuccess(arg.serviceName, arg.queryString));
      });
      ipcRenderer.on('alert-message', (event, arg) => {
        alert(arg.message);
      });
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
