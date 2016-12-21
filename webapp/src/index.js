import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import SwipesAPIConnector from './classes/api-connector';
import './react/global-styles/reset.scss';
import './react/global-styles/app.scss';
import './react/global-styles/transitions.scss';

const getURLParameter = name => decodeURIComponent((new  RegExp(`[?|&]${name}=` + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null; // eslint-disable-line
const regeneratorRuntime = require('babel-runtime/regenerator'); // eslint-disable-line
if (!regeneratorRuntime.default) {
  regeneratorRuntime.default = regeneratorRuntime;
}

// Include stylesheet (compile sass)

let Page;
let RenderedComp;
const props = {};


let Tester;
if (process.env.NODE_ENV !== 'production') {
  Tester = require('./Tester'); // eslint-disable-line
}
if (typeof Tester !== 'undefined') {
  RenderedComp = Tester;
} else if (!window.process || !window.process.versions.electron) {
  if (window.__share_data) {
    window.swipesApi = new SwipesAPIConnector(window.location.origin);
    Page = require('./containers/SharePage'); // eslint-disable-line
    props.data = window.__share_data;
  } else {
    Page = require('./react/download-page/DownloadPage'); // eslint-disable-line
  }
} else {
  Page = require('./react/app/Root'); // eslint-disable-line
}
Page = require('./react/app/Root');

render(
  RenderedComp || <Page {...props} />
  , document.getElementById('content'),
);
