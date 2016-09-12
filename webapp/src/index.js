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
import SwipesAPIConnector from './classes/sdk/swipes-sdk-rest-api'

const props = {};

// Tester Setup 
// ======================================================
//import SwipesCardList from './components/swipes-card/SwipesCardList'
//props.data = { title: "Test", items: []}
//let Tester = SwipesCardList;
// ======================================================


let Page;
if(typeof Tester !== 'undefined' && process.env.NODE_ENV !== 'production'){
  Page = Tester;
}
else if(!window.process || !window.process.versions.electron){
  if(window.__share_data){
    window.swipesApi = new SwipesAPIConnector(window.location.origin);
    Page = require('./containers/SharePage')
    props.data = window.__share_data;
  }
  else {
    Page = require('./components/download-page/DownloadPage');
  }
}
else{
  Page = require('./containers/Root');
}

render(
  <Page {...props} />
  , document.getElementById('content')
)
