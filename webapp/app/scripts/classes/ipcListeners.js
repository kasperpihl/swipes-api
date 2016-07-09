const {ipcRenderer} = nodeRequire('electron');

import { service } from '../actions'

export default class IpcListeners {
  constructor(store){
    ipcRenderer.on('oauth-success', (event, arg) => {
      store.dispatch(service.handleOAuthSuccess(arg.serviceName, arg.queryString));
    });
  }
}