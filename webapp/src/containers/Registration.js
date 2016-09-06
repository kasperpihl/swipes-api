import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { main } from '../actions';
import { browserHistory } from 'react-router'

import '../components/registration/registration.scss';

import Signup from '../components/registration/Signup'
import Signin from '../components/registration/Signin'

class Registration extends Component {
  constructor(props) {
    super(props)
  }
  componentDidUpdate(){
    const { token } = this.props;
    if(token){
      browserHistory.push('/')
    }
  }
  render() {
  	if(this.props.route.path === "signin"){
  		return <Signin onLogin={this.props.signin} />
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
  signin: main.signin,
  signup: main.signup
})(Registration)
export default ConnectedRegistration
