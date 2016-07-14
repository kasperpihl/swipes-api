import 'babel-polyfill'
const getURLParameter = name => decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null
const regeneratorRuntime = require('babel-runtime/regenerator');
if (!regeneratorRuntime.default) {
  regeneratorRuntime.default = regeneratorRuntime;
}

import React from 'react'
import { render } from 'react-dom'
let Page, data;

if(getURLParameter('share')){
  Page = require('./containers/SharePage')
  data = getURLParameter('share')
}
else if(!window.process || !window.process.versions.electron){
  Page = require('./components/downloadPage');
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