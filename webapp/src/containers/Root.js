import React, { Component, PropTypes } from 'react'

import Router from '../Router'
import configureStore from '../store/configureStore'
import { Provider } from 'react-redux'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

const store = configureStore()

const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState (state){
    return state.get('routing').toJS();
  }
})

// Get classes that needs socket
import Socket from '../classes/socket'
import IpcListener from '../classes/ipc-listener'
import SwipesUrlProvider from '../classes/swipes-url-provider'
// import Slack from '../classes/slack/slack'
import Notifications from '../classes/notifications'

window.swipesUrlProvider = new SwipesUrlProvider(store);
new Socket(store);
new Notifications(store);
// window.slack = new Slack(store);
window.ipcListener = new IpcListener(store);

export default class Root extends Component {
  render() {
    // Passing store to router, needs it to check if signed in.
    return (
      <Provider store={store}>
        <Router history={history} store={store} />
      </Provider>
    )
  }
}

module.exports = Root;
