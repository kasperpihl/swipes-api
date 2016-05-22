var ServiceActions = require('./actions/ServiceActions');

if (window.process && window.process.versions.electron) {
    const {ipcRenderer} = nodeRequire('electron');

    ipcRenderer.on('oauth-success', (event, arg) => {
      ServiceActions.handleOAuthSuccess(arg.serviceName, arg.queryString);
    });
}
