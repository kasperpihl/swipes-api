import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import SwipesBackgroundAnimation from './SwipesBackgroundAnimation'
import FloatingInput from '../swipes-ui/FloatingInput'
import { SwipesLogo } from '../icons'

export default class Signup extends Component {
  componentDidMount() {
  }
  signup(){
    var name = this.refs.name.state.value;
    var email = this.refs.email.state.value;
    var password = this.refs.password.state.value;
    var invcode = this.refs.invcode.state.value;

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
      <div className="sign">
        <SwipesBackgroundAnimation />

        <div className="sign__wrapper">
          <div className="sign__logo">
            <SwipesLogo />
          </div>
          <div className="sign__headline">Welcome to your Swipes</div>
          <div className="sign__card">
            <div className="sign__title">sign up to swipes</div>
            <form className="sign__form" action="" onSubmit={this.preventSubmit}>
              <br/>
              <FloatingInput label="Your Name" type="text" id="name" ref="name" />
              <FloatingInput label="Email" type="email" id="email" ref="email" />
              <FloatingInput label="Password" type="password" id="password" ref="password" />
              <FloatingInput label="Invitation Code" type="text" id="invitation" ref="invcode" />
              <br/>
              <input type="submit" className="sign__form__button sign__form__button--submit" value="SIGN UP" onClick={this.signup.bind(this)}/>
            </form>
          </div>
          <div className="sign__subheadline">Already have an account?</div>
          <div className="sign__button"><Link to="/signin">SIGN IN</Link></div>
        </div>
      </div>
    );
  }
}
