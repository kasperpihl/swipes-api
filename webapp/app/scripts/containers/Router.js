import React, { Component, PropTypes } from 'react'

import { browserHistory, Router, Route, IndexRoute } from 'react-router'


import Registration from '../containers/Registration';
var App = require('../components/App');

let SmallComp = (props) => {
  return (<div>Yeah</div>);
}



export default class Root extends Component {
  constructor(props) {
    super(props)
    this.didEnterSignup = this.didEnterSignup.bind(this);
    this.didEnterApp = this.didEnterApp.bind(this);
  }
  // Check if signed in, otherwise redirect to signin
  didEnterApp(nextState, replace){
    if(!this.props.store.getState().auth.token){
      return replace('/signin')
    }
  }
  // Check if signed in and redirect to app
  didEnterSignup(nextState, replace){
    if(this.props.store.getState().auth.token){
      return window.location.assign("/")
    }
  }
  render() {
    return (
      <Router history={browserHistory} >
        <Route path="signin" component={Registration} onEnter={this.didEnterSignup} />
        <Route path="signup" component={Registration} onEnter={this.didEnterSignup} />
        <Route path="/" component={App}>
          <IndexRoute component={SmallComp} onEnter={this.didEnterApp} />
        </Route>
      </Router>
    )
  }
}