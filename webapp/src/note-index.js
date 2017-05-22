import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import ExternalNoteView from './react/external-note-view/ExternalNoteView';

// Include stylesheet (compile sass)
import './react/global-styles/reset.scss';
import './react/global-styles/app.scss';

window.getURLParameter = name => decodeURIComponent((new  RegExp(`[?|&]${name}=` + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null; // eslint-disable-line
const regeneratorRuntime = require('babel-runtime/regenerator'); // eslint-disable-line
if (!regeneratorRuntime.default) {
  regeneratorRuntime.default = regeneratorRuntime;
}


render(
  <ExternalNoteView />, document.getElementById('content'),
);
