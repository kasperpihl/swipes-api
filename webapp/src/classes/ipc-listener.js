const {ipcRenderer} = nodeRequire('electron');

import { me } from '../actions'

export default class IpcListener {
  constructor(store) {
    ipcRenderer.on('oauth-success', (event, arg) => {
      store.dispatch(me.handleOAuthSuccess(arg.serviceName, arg.queryString));
    });
    ipcRenderer.on('alert-message', (event, arg) => {
      alert(arg.message);
    });
  }
  sendEvent(name, data){
    var functionName = 'send';
    if(name === 'showItemInFolder'){
      functionName = 'sendSync'
    }
    return ipcRenderer[functionName](name, data);
  }
}
