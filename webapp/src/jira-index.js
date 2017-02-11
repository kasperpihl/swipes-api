import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import JiraAuth from './react/jira-auth/JiraAuth';

// Include stylesheet (compile sass)
import './react/global-styles/reset.scss';
import './react/global-styles/app.scss';
import './react/global-styles/transitions.scss';

const getURLParameter = name => decodeURIComponent((new  RegExp(`[?|&]${name}=` + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null; // eslint-disable-line
const regeneratorRuntime = require('babel-runtime/regenerator'); // eslint-disable-line
if (!regeneratorRuntime.default) {
  regeneratorRuntime.default = regeneratorRuntime;
}


render(
  <JiraAuth />, document.getElementById('content'),
);
