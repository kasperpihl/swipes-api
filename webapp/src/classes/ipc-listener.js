const {ipcRenderer} = nodeRequire('electron');

import { me } from '../actions'

export default class IpcListener {
  constructor(store) {
    ipcRenderer.on('oauth-success', (event, arg) => {
      store.dispatch(me.handleOAuthSuccess(arg.serviceName, arg.queryString));
    });
  }
  sendSyncEvent(name, data){
    return ipcRenderer.sendSync(name, data);
  }
  sendEvent(name, data){
    ipcRenderer.send(name, data);
  }
}
