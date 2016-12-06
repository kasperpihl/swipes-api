import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { overlay, main, modal } from '../../../actions';
import { bindAll } from '../../../classes/utils';
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
    const { pushOverlay } = this.props;

    pushOverlay({ component: 'Services', title: 'Services' });
  }
  render() {
    const { me } = this.props;

    return (
      <div className="profile">
        <div className="profile__image"><img src={me.get('profile_pic')} role="presentation" /></div>
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
  pushOverlay: func,
  me: map,
};

const ConnectedHOCProfile = connect(mapStateToProps, {
  pushOverlay: overlay.push,
  loadModal: modal.load,
  logout: main.logout,
})(HOCProfile);

export default ConnectedHOCProfile;
