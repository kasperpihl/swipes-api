import React, { PureComponent, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import { bindAll } from 'swipes-core-js/classes/utils';
import Profile from './Profile';

class HOCProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      firstName: props.me.get('first_name') || '',
      lastName: props.me.get('last_name') || '',
      role: props.me.get('role') || '',
      bio: props.me.get('bio') || '',
      email: props.me.get('email') || '',
    };
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
})(HOCProfile);

export default ConnectedHOCProfile;
