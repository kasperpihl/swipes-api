import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import SwipesBackgroundAnimation from './SwipesBackgroundAnimation'

export default class Signup extends Component {
  componentDidMount() {
  }
  signup(){
    var name = this.refs.name.value;
    var email = this.refs.email.value;
    var password = this.refs.password.value;
    var invcode = this.refs.invcode.value;
    if(!invcode){
      return alert("Please use invitation code");
    }
    // Congratulations, if you found this, you deserve to create an account.
    if(!invcode.startsWith("SW319-")){
      return alert("Wrong invitation code");
    }
    var data = {
      email: email,
      name: name,
      password: password,
      repassword: password
    };
    this.props.onSignup(data);
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
            <h2>sign up to swipes</h2>
            <form action="" onSubmit={this.preventSubmit}>
              <br/>
              <input type="text" placeholder="Your Name" ref="name"/>
              <input type="text" placeholder="Email" ref="email" id="email" className="username"/>
              <input type="text" placeholder="Password" ref="password" type="password" />
              <input type="text" placeholder="Invitation Code" ref="invcode" />
              <br/>
              <input type="submit" className="login-submit" value="SIGN UP" onClick={this.signup.bind(this)}/>
            </form>
          </div>
          <h3>Already have an account?</h3>
          <div className="signup-button"><Link to="/signin">SIGN IN</Link></div>
        </div>
      </div>
    );
  }
}
