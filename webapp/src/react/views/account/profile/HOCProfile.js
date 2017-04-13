import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { map } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
// import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
import Profile from './Profile';

class HOCProfile extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      firstName: this.valueForKey('firstName'),
      lastName: this.valueForKey('lastName'),
      role: this.valueForKey('role'),
      bio: this.valueForKey('bio'),
      email: this.valueForKey('email'),
    };

    setupLoading(this);
  }
  valueForKey(key) {
    const { me } = this.props;
    switch(key) {
      case 'firstName': return msgGen.users.getFirstName(me);
      case 'lastName': return msgGen.users.getLastName(me);
      case 'role': return msgGen.users.getRole(me);
      case 'bio': return msgGen.users.getBio(me);
      case 'email': return msgGen.users.getEmail(me);
      default:
        return ''
    }
  }
  onBlur(key) {
    const { updateProfile } = this.props;
    const value = this.state[key];
    const orgVal = this.valueForKey(key);
    if(value !== orgVal){
      this.setLoading(key);
      updateProfile({ [key]: value }).then((res) => {
        if(res && res.ok) {
          this.clearLoading(key, 'success', 1500);
        } else {
          this.clearLoading(key, '!Something went wrong');
        }
      })
      console.log('fucking change!!!', key);
    }
    console.log('blur', key);

  }
  onChange(key, val) {
    this.setState({ [key]: val });
  }
  render() {
    const { me } = this.props;
    const { firstName, lastName, role, bio, email } = this.state;

    return (<Profile
      me={me}
      delegate={this}
      loadingState={this.getAllLoading()}
      getLoading={this.getLoading}
      firstName={firstName}
      lastName={lastName}
      role={role}
      bio={bio}
      email={email}
    />);
  }
}

function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

// const { func, string } = PropTypes;

HOCProfile.propTypes = {
  me: map,
};

const ConnectedHOCProfile = connect(mapStateToProps, {
  updateProfile: ca.me.updateProfile,
})(HOCProfile);

export default ConnectedHOCProfile;
