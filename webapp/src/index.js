import 'babel-polyfill'
const getURLParameter = name => decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null
const regeneratorRuntime = require('babel-runtime/regenerator');
if (!regeneratorRuntime.default) {
  regeneratorRuntime.default = regeneratorRuntime;
}


// Include stylesheet (compile sass)
import './components/global-styles/reset.scss'
import './components/global-styles/app.scss'

import React from 'react'
import { render } from 'react-dom'
let Page, data;
import SwipesAPIConnector from './classes/sdk/swipes-sdk-rest-api'

// import SwipesCard from './components/swipes-card/SwipesCard'
// Component tester: import the component, add it below, and change false to true.
// OBS: Works only in browser
if(!window.process || !window.process.versions.electron){
  if(false){
    //
    //Page = SwipesCard;
  }
  else if(window.__share_data){
    window.swipesApi = new SwipesAPIConnector(window.location.origin);
    Page = require('./containers/SharePage')
    data = window.__share_data;
  }
  else {
    Page = require('./components/download-page/DownloadPage');
  }
}
else{
  Page = require('./containers/Root');
}

render( 
  <Page data={data} />
  , document.getElementById('content')
)