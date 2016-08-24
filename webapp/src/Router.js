import React, { Component, PropTypes } from 'react'

import { browserHistory, Router, Route, IndexRoute } from 'react-router'


import Registration from './containers/Registration';
import App from './containers/App'
import Workspace from './containers/Workspace'
import Services from './containers/Services'


export default class Root extends Component {
  constructor(props) {
    super(props)
    this.didEnterRegistration = this.didEnterRegistration.bind(this);
    this.didEnterApp = this.didEnterApp.bind(this);
  }
  // Check if signed in, otherwise redirect to signin
  didEnterApp(nextState, replace){
    if(!this.props.store.getState().main.token){
      return replace('/signin')
    }
  }
  // Check if signed in and redirect to app
  didEnterRegistration(nextState, replace){
    if(this.props.store.getState().main.token){
      return window.location.assign("/")
    }
  }
  render() {
    return (
      <Router history={browserHistory} >
        <Route path="signin" component={Registration} onEnter={this.didEnterRegistration} />
        <Route path="signup" component={Registration} onEnter={this.didEnterRegistration} />
        <Route path="/" component={App}>
          <IndexRoute component={Workspace} onEnter={this.didEnterApp} />
          <Route path="services" component={Services} onEnter={this.didEnterApp} />
        </Route>
      </Router>
    )
  }
}