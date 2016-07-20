import 'babel-polyfill'
const getURLParameter = name => decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null
const regeneratorRuntime = require('babel-runtime/regenerator');
if (!regeneratorRuntime.default) {
  regeneratorRuntime.default = regeneratorRuntime;
}

import React from 'react'
import { render } from 'react-dom'
let Page, data;

if(!window.process || !window.process.versions.electron){
  if(true){
    require('expose?_!underscore');
    Page = require('./components/resizeable-grid/grid_test');
    console.log('here I am.')
  }
  else if(window.__share_data){
    require('expose?$!expose?jQuery!jquery');
    //var SwipesAPIConnector = require('../../swipes-sdk/swipes-api-connector');
    window.swipesApi = new SwipesAPIConnector(window.location.origin);
    Page = require('./containers/SharePage')
    data = window.__share_data;
  }
  else {
    Page = require('./components/downloadPage');
  }
}
else{
  require('expose?$!expose?jQuery!jquery');
  require('expose?_!underscore');
  require("react-tap-event-plugin")();

  Page = require('./containers/Root');
}

render( 
  <Page data={data} />
  , document.getElementById('content')
)