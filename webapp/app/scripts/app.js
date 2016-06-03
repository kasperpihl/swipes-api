if (window.process && window.process.versions.electron) {
  // Reflux extension for easier handling data/localstorage etc.
  require('reflux-model-extension');
  // Geting events from the oauth popup
  require('./oauth-electron-handler');
  require("react-tap-event-plugin")();

  const Router = require('./router');
  const defaultMenu = require('./electron-default-menu');
  // Set a top-level application menu
  const {Menu} = nodeRequire('electron').remote;
  const menu = defaultMenu();

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));

  Router.start();
} else {
  const React = require('react');
  const ReactDOM = require('react-dom');
  const DownloadPage = require('./components/downloadPage');

  ReactDOM.render(<DownloadPage />, document.body);
}
