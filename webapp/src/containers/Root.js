import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'

import Router from '../Router'
import configureStore from '../store/configureStore'


const store = configureStore()
// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

// Get classes that needs socket
import Socket from '../classes/socket'
import IpcListener from '../classes/ipc-listener'
import SwipesUrlProvider from '../classes/swipes-url-provider'
import Notifications from '../classes/notifications'

window.swipesUrlProvider = new SwipesUrlProvider(store);
new Socket(store);
new Notifications(store);
window.ipcListener = new IpcListener(store);

export default class Root extends Component {
  render() {
    // Passing store to router, needs it to check if signed in.
    return (
      <Provider store={store}>
        <Router store={store} history={history} />
      </Provider>
    )
  }
}

module.exports = Root;