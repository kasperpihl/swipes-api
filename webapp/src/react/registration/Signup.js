import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Icon from 'Icon';
// import SwipesBackgroundAnimation from './SwipesBackgroundAnimation';
import FloatingInput from 'components/swipes-ui/FloatingInput';


export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.signup = this.signup.bind(this);
  }
  componentDidMount() {
  }
  signup() {
    const name = this.refs.name.state.value;
    const email = this.refs.email.state.value;
    const password = this.refs.password.state.value;
    const organization = this.refs.organization.state.value;
    const invcode = this.refs.invcode.state.value;

    const data = {
      email,
      name,
      password,
      repassword: password,
      invitation_code: invcode,
      organization,
    };

    this.props.onSignup(data);

    return undefined;
  }
  preventSubmit(e) {
    e.preventDefault();
  }
  render() {
    return (
      <form className="sign__form" action="" onSubmit={this.preventSubmit}>
        <br />
        <FloatingInput label="Your Name" type="text" id="name" ref="name" />
        <FloatingInput label="Email" type="email" id="email" ref="email" />
        <FloatingInput label="Password" type="password" id="password" ref="password" />
        <FloatingInput
          label="Organization"
          type="text"
          id="organization"
          ref="organization"
        />
        <FloatingInput label="Invitation Code" type="text" id="invitation" ref="invcode" />
        <br />
        <input
          type="submit"
          className="sign__form__button sign__form__button--submit"
          value="SIGN UP"
          onClick={this.signup}
        />
      </form>
    );
  }
}

const { func } = PropTypes;

Signup.propTypes = {
  onSignup: func,
};
