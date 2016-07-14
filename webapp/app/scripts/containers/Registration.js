import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { main } from '../actions';

import Signup from '../components/registration/Signup'
import Signin from '../components/registration/Signin'

class Registration extends Component {
  constructor(props) {
    super(props)
  }
  componentDidUpdate(){
    if(this.props.token){
      browserHistory.push('/')
    }
  }
  render() {
  	if(this.props.route.path === "signin"){
  		return <Signin onLogin={this.props.login} />
  	}
  	return <Signup onSignup={this.props.signup} />
  }
}

function mapStateToProps(state) {
  return {
    token: state.main.token
  }
}

const ConnectedRegistration = connect(mapStateToProps, {
  login: main.login,
  signup: main.signup
})(Registration)
export default ConnectedRegistration
