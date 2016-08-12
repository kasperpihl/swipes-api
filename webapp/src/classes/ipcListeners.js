const {ipcRenderer} = nodeRequire('electron');

import { me } from '../actions'

export default class IpcListeners {
  constructor(store) {
    ipcRenderer.on('oauth-success', (event, arg) => {
      store.dispatch(me.handleOAuthSuccess(arg.serviceName, arg.queryString));
    });
  }
}
