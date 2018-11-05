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

import Socket from 'swipes-core-js/classes/Socket';
import Root from './react/Root';

import './swiss';

const { store, persistor } = configureStore({
  globals: getGlobals(),
});
if (process.env.NODE_ENV !== 'production') {
  window.openTester = () => {
    store.dispatch({
      type: 'DEV_OPEN_TESTER',
    });
  };
}

window.ipcListener = new IpcListener(store);
window.analytics = new Analytics(store);
window.socket = new Socket(store);

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
