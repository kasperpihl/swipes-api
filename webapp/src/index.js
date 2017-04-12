import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import './react/global-styles/reset.scss';
import './react/global-styles/app.scss';
import './react/global-styles/transitions.scss';
import { version } from '../package.json';

const regeneratorRuntime = require('babel-runtime/regenerator'); // eslint-disable-line
if (!regeneratorRuntime.default) {
  regeneratorRuntime.default = regeneratorRuntime;
}

window.__VERSION__ = version;
window.__DEV__ = (process.env.NODE_ENV !== 'production');
window.__API_URL__ = `${location.origin}`;
window.getURLParameter = name => decodeURIComponent((new RegExp(`[?|&]${name}=` + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null; // eslint-disable-line

const Page = require('./react/app/Root').default;

let RenderedComp;
if (process.env.NODE_ENV !== 'production') {
  RenderedComp = require('./Tester').default; // eslint-disable-line
}

render(
  RenderedComp || <Page />
  , document.getElementById('content'),
);
