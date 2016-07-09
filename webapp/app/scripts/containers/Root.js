import React, { Component, PropTypes } from 'react'

import Router from '../Router'
import configureStore from '../store/configureStore'
import { Provider } from 'react-redux'

import { api } from '../actions'
const store = configureStore()
import socket from '../classes/socket'
const socketObj = new socket(store)
store.dispatch(api.request('rtm.start')).then((res) => {
  console.log('result from rtm', res);
})

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