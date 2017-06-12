import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { Platform, View, Text } from 'react-native';

import App from './App';
import configureStore from './store/configureStore';
import { init } from '../swipes-core-js';
import * as a from './actions';

const store = configureStore();

window.__API_URL__ = 'https://staging.swipesapp.com';
window.__WITHOUT_NOTES__ = true;
window.getHeaders = () => ({
  'sw-platform': Platform.OS,
});

init(store);
window.onScroll = function(store){
  let posY = undefined;
  let compareY = undefined;
  let collapsed = false;
  store.subscribe(() => {
    const state = store.getState();
    if(collapsed && !state.getIn(['navigation', 'collapsed'])) {
      posY = undefined;
      compareY = undefined;
      direction = undefined;
      collapsed = false;
    } else if(!collapsed && state.getIn(['navigation', 'collapsed'])) {
      collapsed = true;
    }
  });
  function onScroll(sE) {
    //console.log(sE.nativeEvent.contentOffset.y, posY);
    posY = sE.nativeEvent.contentOffset.y;
    if(typeof compareY !== 'undefined') {
      if(collapsed) {
        if(posY >= compareY) {
          compareY = posY;
        } else {
          if((compareY - posY) > 20) {
            store.dispatch(a.navigation.setCollapsed(false));
            compareY = posY;
          }
        }
      } else {
        if(posY <= compareY) {
          compareY = posY;
        } else {
          if((posY - compareY) > 20) {
            store.dispatch(a.navigation.setCollapsed(true));
            compareY = posY;
          }
        }
      }
    } else {
      compareY = posY;
    }
  }
  return onScroll;
}(store);

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
