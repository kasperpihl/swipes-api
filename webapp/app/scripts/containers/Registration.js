import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { auth } from '../actions';

import Signup from '../components/registration/Signup'
import Signin from '../components/registration/Signin'

export default class Registration extends Component {
  constructor(props) {
    super(props)
    this.onLogin = this.onLogin.bind(this);
  }
  onLogin(token){
  	this.props.login(token)
  	browserHistory.push('/')
  }
  render() {
  	if(this.props.route.path === "signin"){
  		return <Signin onLogin={this.onLogin} />
  	}
  	return <Signup onLogin={this.onLogin} />
  }
}

const ConnectedRegistration = connect(null, {
  login: auth.login
})(Registration)
export default ConnectedRegistration
