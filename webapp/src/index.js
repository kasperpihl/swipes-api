import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import './react/global-styles/reset.scss';
import './react/global-styles/app.scss';
import './react/global-styles/transitions.scss';
import { version } from '../package.json';

const getURLParameter = name => decodeURIComponent((new  RegExp(`[?|&]${name}=` + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null; // eslint-disable-line
const regeneratorRuntime = require('babel-runtime/regenerator'); // eslint-disable-line
if (!regeneratorRuntime.default) {
  regeneratorRuntime.default = regeneratorRuntime;
}

window.__VERSION__ = version;
window.__DEV__ = (process.env.NODE_ENV !== 'production');
window.__API_URL__ = `${location.origin}`;

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
  Page = require('./react/download-page/DownloadPage'); // eslint-disable-line
} else {
  Page = require('./react/app/Root'); // eslint-disable-line
}
// Page = require('./react/app/Root');

render(
  RenderedComp || <Page {...props} />
  , document.getElementById('content'),
);
