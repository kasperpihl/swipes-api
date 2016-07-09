import React, { Component, PropTypes } from 'react'

import Router from '../Router'
import configureStore from '../store/configureStore'
import { Provider } from 'react-redux'

const store = configureStore()
import socket from '../classes/socket'
const socketObj = new socket(store)

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