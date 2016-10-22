const {ipcRenderer} = nodeRequire('electron');

import { me, toasty } from '../actions';

const toasts = {};

export default class IpcListener {
  constructor(store) {
    ipcRenderer.on('oauth-success', (event, arg) => {
      store.dispatch(me.handleOAuthSuccess(arg.serviceName, arg.queryString));
    });
    ipcRenderer.on('alert-message', (event, arg) => {
      alert(arg.message);
    });
    ipcRenderer.on('toasty', (event, arg) => {
      const options = {
        title: arg.filename,
        progress: arg.percentage
      }

      if (arg.state === 'completed') {
        options.completed = true;
        options.duration = 3000;
      }

      if (toasts[arg.id]) {
        store.dispatch(toasty.update(toasts[arg.id], options));
        if (arg.state === 'completed') {
          delete toasts[arg.id];
        }
      } else {
        store.dispatch(toasty.add(options)).then((toastId) => {
          toasts[arg.id] = toastId;
        })
      }
    })
  }
  sendEvent(name, data){
    var functionName = 'send';
    if(name === 'showItemInFolder'){
      functionName = 'sendSync'
    }
    return ipcRenderer[functionName](name, data);
  }
}
