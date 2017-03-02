import React, { PureComponent, PropTypes } from 'react';
import Button from 'Button';
import { map } from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as a from 'actions';
import { bindAll } from 'classes/utils';
import './profile.scss';

class HOCProfile extends PureComponent {
  constructor(props) {
    super(props);
    bindAll(this, ['clickedServices', 'onLogout']);
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
  };
}

const { func } = PropTypes;

HOCProfile.propTypes = {
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
