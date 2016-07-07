// Reflux extension for easier handling data/localstorage etc.
require('reflux-model-extension');
// Geting events from the oauth popup
require('./oauth-electron-handler');
require("react-tap-event-plugin")();

import React from 'react'
import { render } from 'react-dom'




import Root from './containers/Root'

if (window.process && window.process.versions.electron) {
  require('expose?$!expose?jQuery!jquery');
  require('expose?_!underscore');
  require('expose?Q!q');
  require('expose?io!socket.io-client');
  
  window.swipesApi = new SwipesAPIConnector(window.location.origin);

  

  const defaultMenu = require('./electron-default-menu');
  // Set a top-level application menu
  const {Menu} = nodeRequire('electron').remote;
  const menu = defaultMenu();

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));

  
  render( <Root />, document.getElementById('content'))

} else {
  const DownloadPage = require('./components/downloadPage');

  render(<DownloadPage />, document.getElementById('content'));
}
