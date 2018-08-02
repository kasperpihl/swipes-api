import 'babel-polyfill';
import React, { PureComponent } from 'react'
import { render } from 'react-dom';

import 'src/react/global-styles/reset.scss';
import 'src/react/global-styles/app.scss';

import 'src/swiss';


const regeneratorRuntime = require('babel-runtime/regenerator'); // eslint-disable-line
if (!regeneratorRuntime.default) {
  regeneratorRuntime.default = regeneratorRuntime;
}

const loadPage = (Page, props) => {
  render(
    <Page {...props}/>, document.getElementById('content'),
  );
}

export default loadPage;
