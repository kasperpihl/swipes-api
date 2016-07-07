import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import configureStore from '../store/configureStore'

var Reflux = require('reflux');
import routes from '../routes'
import { Router } from 'react-router'
var history = require('react-router').browserHistory;

const store = configureStore()

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <Router routes={routes} history={history} />
        </div>
      </Provider>
    )
  }
}