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
      <div className="sign">
        <SwipesBackgroundAnimation />
        <div className="sign__wrapper">
          <div className="sign__logo"></div>
          <div className="sign__headline">Welcome to your Swipes</div>
          <div className="sign__card">
            <div className="sign__title">sign in to swipes</div>
            <form className="sign__form" action="" onSubmit={this.preventSubmit}>
              <br />
              <FloatingInput label="Email" type="email" id="email" ref="username" />
              <FloatingInput label="Password" type="password" id="password" ref="password" />
              <br />
              <input type="submit" className="sign__form__button sign__form__button--submit" value="SIGN IN" onClick={this.signin.bind(this)}/>
            </form>
          </div>
          <div className="sign__subheadline">No account yet?</div>
          <div className="sign__button"><Link to="/signup">SIGN UP</Link></div>
        </div>
      </div>
    );
  }
};
