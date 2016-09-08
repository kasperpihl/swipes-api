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
let Page;
const props = {};
import SwipesAPIConnector from './classes/sdk/swipes-sdk-rest-api'
import GridTest from './components/resizeable-grid/grid_test'

// import SwipesCardList from './components/swipes-card/SwipesCardList'
// Component tester: import the component, add it below, and change false to true.
// OBS: Works only in browser
if(!window.process || !window.process.versions.electron){

  // props.data = {
  //   title: 'This is title',
  //   items: [
  //     {
  //       title: 'Lorem ipsum dolor sit.',
  //       subtitle: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat rem nostrum blanditiis vitae? Delectus fugiat temporibus libero ullam saepe laboriosam!'
  //     },
  //     {
  //       title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque aperiam consequatur deserunt sapiente eum odit tenetur impedit veritatis voluptates, harum animi quis eligendi dicta at repudiandae corporis error iure ipsa.'
  //     },
  //     {
  //       title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus ex accusamus, debitis totam velit reprehenderit aperiam saepe harum recusandae consectetur ipsa nisi, doloribus at laudantium iste nesciunt? Assumenda, magnam odit.',
  //       subtitle: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, natus.'
  //     }
  //   ]
  // }

  if(false) {
    // Page = SwipesCardList;
  }
  else if(window.__share_data){
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
