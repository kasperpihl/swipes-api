import React, { Component, PropTypes } from 'react';
import Icon from 'Icon';
import { map } from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { navigation, main } from 'actions';
import { bindAll } from 'classes/utils';
import './profile.scss';


class HOCProfile extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['clickedServices', 'onLogout']);
  }
  onLogout() {
    const { loadModal } = this.props;

    loadModal({ title: 'Log out', data: { message: 'Do you want to log out?', buttons: ['No', 'Yes'] } }, (res) => {
      if (res && res.button) {
        this.props.logout();
      }
    });
  }
  clickedServices() {
    const { navPush } = this.props;

    navPush({ component: 'Services', title: 'Services' });
  }
  renderProfileImage() {
    const { me } = this.props;

    if (me.get('profile_pic')) {
      return <img src={me.get('profile_pic')} role="presentation" />;
    }

    const initials = me.get('name').substring(0, 1);

    return <div className="profile__img-name">{initials}</div>;
  }
  render() {
    const { me } = this.props;

    return (
      <div className="profile">
        <div className="profile__image">
          {this.renderProfileImage()}
        </div>
        <div className="profile__name">{me.get('name')}</div>
        <div className="profile__organization">{me.getIn(['organizations', 0, 'name'])}</div>
        <div className="profile__button profile__button--nav" onClick={this.clickedServices}>
          Services
        </div>
        <div className="profile__button profile__button--logout" onClick={this.onLogout}>
          <i className="material-icons">power_settings_new</i>
        </div>
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
  loadModal: func,
  logout: func,
  navPush: func,
  me: map,
};

const ConnectedHOCProfile = connect(mapStateToProps, {
  loadModal: main.modal,
  logout: main.logout,
})(HOCProfile);

export default ConnectedHOCProfile;
