import 'src/utils/polyfills';

import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createLocation } from 'history';

import getGlobals from 'src/utils/globals';
import configureStore from 'src/redux/configureStore';

import Analytics from 'src/classes/analytics';
import IpcListener from 'src/classes/ipc-listener';

import { init } from 'swipes-core-js';
import * as mainActions from 'src/redux/main/mainActions';
import Root from './react/Root';

import './swiss';

const store = configureStore({
  globals: getGlobals()
});
if (process.env.NODE_ENV !== 'production') {
  window.openTester = () => {
    store.dispatch({
      type: 'DEV_OPEN_TESTER'
    })
  }
  
}

window.ipcListener = new IpcListener(store);
window.analytics = new Analytics(store);

const delegate = {
  forceLogout: () => {
    store.dispatch(mainActions.forceLogout);
  },
  sendEvent: analytics.sendEvent,
}
init(store, delegate);

render(
  <Provider store={store}>
    <BrowserRouter forceRefresh={false}>
      <Root />
    </BrowserRouter>
  </Provider>
  , document.getElementById('content'),
);
