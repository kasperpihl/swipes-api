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
window.__AWS_KEY__ = 'AKIAJ7OR4Q4MA5VBPTKA';
window.__AWS_SECRECT__ = '1Y4j3QuBg1mDmEtQQ+zNzIpsZ1B+n4d0XSuLkxF5';

let Page;
let RenderedComp;
const props = {};


let Tester;
if (process.env.NODE_ENV !== 'production') {
  Tester = require('./Tester').default; // eslint-disable-line
}
if (typeof Tester !== 'undefined') {
  console.log('tester', Tester);
  RenderedComp = Tester;
} else if (!window.process || !window.process.versions.electron) {
  Page = require('./react/download-page/DownloadPage').default; // eslint-disable-line
} else {
  Page = require('./react/app/Root').default; // eslint-disable-line
}
// Page = require('./react/app/Root');

render(
  RenderedComp || <Page {...props} />
  , document.getElementById('content'),
);
