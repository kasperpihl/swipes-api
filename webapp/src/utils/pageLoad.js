import 'babel-polyfill';
import React, { PureComponent } from 'react';
import { SwissProvider } from 'swiss-react';
import { render } from 'react-dom';

import 'src/scss/reset.scss';
import 'src/scss/app.scss';

import 'src/swiss';

const regeneratorRuntime = require('babel-runtime/regenerator'); // eslint-disable-line
if (!regeneratorRuntime.default) {
  regeneratorRuntime.default = regeneratorRuntime;
}

const loadPage = (Page, props) => {
  render(
    <SwissProvider>
      <Page {...props} />
    </SwissProvider>,
    document.getElementById('content')
  );
};

export default loadPage;
