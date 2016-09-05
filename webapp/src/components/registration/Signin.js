import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import SwipesBackgroundAnimation from './SwipesBackgroundAnimation'
import FloatingInput from '../swipes-ui/FloatingInput'


export default class Signin extends Component {
  componentDidMount() {
  }
  signin(){
    var email = this.refs.username.state.value;
    var password = this.refs.password.state.value;
    var data = {
      email: email,
      password: password
    };

    return this.props.onLogin(data);
  }
  preventSubmit(e) {
    e.preventDefault();
  }
  render() {
    return (
      <div className="main-log-wrapper">
        <SwipesBackgroundAnimation />
        <div className="wrapper">
          <div className="logo"></div>
          <h1>Welcome to your Swipes</h1>
          <div className="sign-up-card">
            <h2>sign in to swipes</h2>
            <form action="" onSubmit={this.preventSubmit}>
              <br/>
              <FloatingInput label="Email" type="email" id="email" ref="username" />
              <FloatingInput label="Password" type="password" id="password" ref="password" />
              <br/>
              <input type="submit" className="login-submit" value="SIGN IN" onClick={this.signin.bind(this)}/>
            </form>
          </div>
          <h3>No account yet?</h3>
          <div className="signup-button"><Link to="/signup">SIGN UP</Link></div>
        </div>
      </div>
    );
  }
};
