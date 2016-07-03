if (window.process && window.process.versions.electron) {

  require('expose?$!expose?jQuery!jquery');
  require('expose?_!underscore');
  require('expose?Q!q');
  require('expose?io!socket.io-client');
  
  //var SwipesAPIConnector = require('../../swipes-sdk/swipes-api-connector');
  window.swipesApi = new SwipesAPIConnector(window.location.origin);

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

  ReactDOM.render(<DownloadPage />, document.getElementById('content'));
}
