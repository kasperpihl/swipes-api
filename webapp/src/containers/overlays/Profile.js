import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { overlay, main } from '../../actions'
import { bindAll } from '../../classes/utils'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import '../../components/profile/profile.scss'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['clickedServices', 'onLogout'])
  }
  clickedServices(){
    const { pushOverlay } = this.props;
    pushOverlay({component: "Services", title: "Services"});
  }
  onLogout() {
    this.props.logout();
  }
  render() {
    const { me } = this.props;
    console.log('me.toJS()', me.toJS());

    return (
      <div className="profile">
        <div className="profile__image"><img src={me.get('profile_pic')} /></div>
        <div className="profile__name">{me.get('name')}</div>
        <div className="profile__organization">{me.getIn(['organizations', 0, 'name'])}</div>
        <div className="profile__button profile__button--nav" onClick={this.clickedServices}>Services</div>
        <div className="profile__button profile__button--logout" onClick={this.onLogout}>
          <i className="material-icons">power_settings_new</i>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    me: state.get('me')
  }
}

import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
const { string } = PropTypes;
Profile.propTypes = {
}


const ConnectedProfile = connect(mapStateToProps, {
  pushOverlay: overlay.push,
  logout: main.logout
})(Profile)
export default ConnectedProfile
