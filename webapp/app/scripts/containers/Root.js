import React, { Component, PropTypes } from 'react'

import Router from './Router'
import configureStore from '../store/configureStore'
import { Provider } from 'react-redux'

const store = configureStore()
store.subscribe(() => {
  console.log('store update', store.getState());
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