import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { Platform } from 'react-native';

import App from './App';
import configureStore from './store/configureStore';
import { init, actions } from '../swipes-core-js';

const store = configureStore();

window.__API_URL__ = 'https://staging.swipesapp.com';
window.getHeaders = () => {
  return {
    'sw-platform': Platform.OS,
  }
}

init(store);

class Root extends PureComponent {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

export default Root;
