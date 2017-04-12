import React, { PureComponent, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
// import * as a from 'actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
import Profile from './Profile';

class HOCProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      firstName: msgGen.users.getFirstName(props.me),
      lastName: msgGen.users.getLastName(props.me),
      role: props.me.get('role') || '',
      bio: props.me.get('bio') || '',
      email: msgGen.users.getEmail(props.me),
    };

    setupLoading(this);
  }
  componentDidMount() {
    this.setLoading('role');
    this.setLoading('bio');
    this.setLoading('bio');
    this.setLoading('firstName');
    this.setLoading('lastName');
    this.setLoading('image');
    setTimeout(() => {
      this.clearLoading('firstName', '!Something went wrong');
      this.clearLoading('lastName', 'Something went wrong', 3000);
    }, 1000);
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
})(HOCProfile);

export default ConnectedHOCProfile;
