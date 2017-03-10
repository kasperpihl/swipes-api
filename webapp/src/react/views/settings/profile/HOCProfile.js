import React, { PureComponent, PropTypes } from 'react';
import Button from 'Button';
import { map } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import * as a from 'actions';
import { bindAll } from 'classes/utils';
import './profile.scss';

class HOCProfile extends PureComponent {
  constructor(props) {
    super(props);
    bindAll(this, ['clickedServices', 'onLogout', 'onInvite']);
    this.state = {
      isLoggingOut: false,
    };
  }
  onLogout(e) {
    const { confirm, logout } = this.props;
    const options = this.getOptionsForE(e);

    confirm(Object.assign({}, options, {
      title: 'Log out',
      message: 'Do you want to log out?',
    }), (i) => {
      if (i === 1) {
        this.setState({ isLoggingOut: true });
        logout(() => {
          this.setState({ isLoggingOut: false });
        });
      }
    });
  }
  onInvite() {
    const { invitationCode } = this.props;
    let emailString = 'Hi team, I am testing a new collaboration tool that will help us work together on goals. It brings our files, links and communication, all in one place. We can iterate on things and give each other feedback.';
    emailString += "%0D%0ALet's give it a try. I'll add a few goals.";
    emailString += '%0D%0A%0D%0A';
    emailString += '1. Go to https://staging.swipesapp.com%0D%0A';
    emailString += '2. Download the app for your device.%0D%0A';
    emailString += `3. Signup using this code: ${invitationCode}`;
    window.open(`mailto:?subject=Invitation to Swipes Workspace&body=${emailString}`);
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'center',
    };
  }
  clickedServices() {
    const { navPush } = this.props;

    navPush({ id: 'Services', title: 'Services' });
  }
  renderProfileImage() {
    const { me } = this.props;

    if (me.get('profile_pic')) {
      return <img src={me.get('profile_pic')} role="presentation" />;
    }

    const initials = me.get('first_name').substring(0, 1) + me.get('last_name').substring(0, 1);

    return <div className="profile__img-name">{initials}</div>;
  }
  render() {
    const { me } = this.props;
    const { isLoggingOut } = this.state;
    return (
      <div className="profile">
        <div className="profile__image">
          {this.renderProfileImage()}
        </div>
        <div className="profile__name">{me.get('first_name')} {me.get('last_name')}</div>
        <div className="profile__organization">{me.getIn(['organizations', 0, 'name'])}</div>
        <Button
          primary
          text="Invite more people"
          className="profile__button profile__button--services"
          onClick={this.onInvite}
        />
        <Button
          primary
          text="Services"
          className="profile__button profile__button--services"
          onClick={this.clickedServices}
        />
        <Button
          icon="Logout"
          loading={isLoggingOut}
          className="profile__button profile__button--logout"
          onClick={this.onLogout}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    me: state.get('me'),
    invitationCode: state.getIn(['me', 'organizations', 0, 'invitation_code']),
  };
}

const { func, string } = PropTypes;

HOCProfile.propTypes = {
  invitationCode: string,
  confirm: func,
  logout: func,
  navPush: func,
  me: map,
};

const ConnectedHOCProfile = connect(mapStateToProps, {
  logout: a.main.logout,
  confirm: a.menus.confirm,
})(HOCProfile);

export default ConnectedHOCProfile;
