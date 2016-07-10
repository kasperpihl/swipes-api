import 'babel-polyfill'
const regeneratorRuntime = require('babel-runtime/regenerator');
if (!regeneratorRuntime.default) {
  regeneratorRuntime.default = regeneratorRuntime;
}

import React from 'react'
import { render } from 'react-dom'

if(!window.process || !window.process.versions.electron){
  const DownloadPage = require('./components/downloadPage');

  render(<DownloadPage />, document.getElementById('content'));
}
else{
  require('expose?$!expose?jQuery!jquery');
  require('expose?_!underscore');

  require("react-tap-event-plugin")();

  window.swipesApi = new SwipesAPIConnector(window.location.origin);

  var Root = require('./containers/Root');

  render( 
    <Root />
    , document.getElementById('content')
  )
}