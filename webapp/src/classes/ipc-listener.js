const {ipcRenderer} = nodeRequire('electron');

import { me } from '../actions'

export default class IpcListener {
  constructor(store) {
    ipcRenderer.on('oauth-success', (event, arg) => {
      store.dispatch(me.handleOAuthSuccess(arg.serviceName, arg.queryString));
    });
  }
  sendEvent(name, data){
    console.log('sending ipc', name, data);
    ipcRenderer.send(name, data);
  }
}
