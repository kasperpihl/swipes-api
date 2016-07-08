import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import SwipesBackgroundAnimation from './SwipesBackgroundAnimation'

let TextField = require('material-ui/lib/text-field');

export default class Signup extends Component {
  componentDidMount() {
    amplitude.logEvent('Session - Opened Signup');
    mixpanel.track('Opened Signup');
  }
  signup(){
    var name = this.refs.name.getValue();
    var email = this.refs.email.getValue();
    var password = this.refs.password.getValue();
    var invcode = this.refs.invcode.getValue();
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

    swipesApi.request({force:true, command:"users.create"}, data, function(res,error){
      console.log(res,error);
      if(res && res.ok){
        mixpanel.alias(res.userId);
        amplitude.logEvent('Session - Created Account');
        mixpanel.track('Created Account');
        this.props.onLogin(res.token)
      }
      else
        alert("Signup failed");
    }.bind(this));
    return;
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
              <TextField floatingLabelText="Your Name" ref="name"/>
              <TextField floatingLabelText="Email" ref="email" id="email" className="username"/>
              <TextField floatingLabelText="Password" ref="password" type="password" />
              <TextField floatingLabelText="Invitation Code" ref="invcode" />
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
