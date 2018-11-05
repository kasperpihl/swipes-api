import 'src/utils/polyfills';

import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';
import { OptimistProvider } from 'react-optimist';
import { PersistGate } from 'redux-persist/es/integration/react';

import { BrowserRouter } from 'react-router-dom';
import getGlobals from 'src/utils/globals';
import configureStore from 'src/redux/configureStore';

import Analytics from 'src/classes/analytics';
import IpcListener from 'src/classes/ipc-listener';

import { setStore } from 'swipes-core-js/utils/store/storeGet';
import Socket from 'swipes-core-js/classes/Socket';

// Init core!
const { store, persistor } = configureStore({
  global: getGlobals()
});

setStore(store); // Make store accessible from core
window.socket = new Socket(store);
// END Init core

import Root from './react/Root';

import './swiss';

if (process.env.NODE_ENV !== 'production') {
  window.openTester = () => {
    store.dispatch({
      type: 'DEV_OPEN_TESTER'
    });
  };
}

window.ipcListener = new IpcListener(store);
window.analytics = new Analytics(store);

render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <OptimistProvider>
          <Root />
        </OptimistProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('content')
);
