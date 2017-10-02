import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import ExternalNoteView from './react/external-note-view/ExternalNoteView';

// Include stylesheet (compile sass)
import './react/global-styles/reset.scss';
import './react/global-styles/app.scss';

const regeneratorRuntime = require('babel-runtime/regenerator'); // eslint-disable-line
if (!regeneratorRuntime.default) {
  regeneratorRuntime.default = regeneratorRuntime;
}

render(
  <ExternalNoteView />, document.getElementById('content'),
);
