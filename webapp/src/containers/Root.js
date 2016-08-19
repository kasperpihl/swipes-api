import React, { Component, PropTypes } from 'react'

import Router from '../Router'
import configureStore from '../store/configureStore'
import { Provider } from 'react-redux'

const store = configureStore()

// Get classes that needs socket
import Socket from '../classes/socket'
import IpcListeners from '../classes/ipc-listeners'
import ShortUrlProvider from '../classes/short-url-provider'

window.shortUrlProvider = new ShortUrlProvider(store);
new Socket(store);
new IpcListeners(store);

export default class Root extends Component {
  render() {
    // Passing store to router, needs it to check if signed in.
    return (
      <Provider store={store}>
        <Router store={store} />
      </Provider>
    )
  }
}

module.exports = Root;