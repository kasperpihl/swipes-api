const {ipcRenderer} = nodeRequire('electron');

import { me } from '../actions'

export default class IpcListener {
  constructor(store) {
    ipcRenderer.on('oauth-success', (event, arg) => {
      store.dispatch(me.handleOAuthSuccess(arg.serviceName, arg.queryString));
    });
  }
  sendEvent(name, data){
    var functionName = 'send';
    if(name === 'showItemInFolder'){
      functionName = 'sendSync'
    }
    ipcRenderer[functionName](name, data);
  }
}
