import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
import Icon from 'Icon';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import HOCLogoutButton from 'compatible/components/logout-button/HOCLogoutButton';
import CompatibleSubHeader from 'compatible/components/subheader/CompatibleSubHeader';
import CompatibleInviteForm from './CompatibleInviteForm';
import GoToWorkspace from 'compatible/components/go-to-workspace/GoToWorkspace';
import CompatibleButton from 'compatible/components/button/CompatibleButton';
import { Link } from 'react-router-dom';
import './styles/compatible-invite.scss';

class CompatibleInvite extends PureComponent {
  constructor(props) {
    super(props);
    setupDelegate(this, 'onSendInvites');
  } 
  
  renderInviteForm() {
    const { delegate, bindLoading, invites } = this.props;

    return (
      <div className="form">
        <CompatibleInviteForm 
          invites={invites} 
          delegate={delegate}
          {...bindLoading()}
        />
        <div className="form__send-button">
          <CompatibleButton onClick={this.onSendInvites} title="Send Invites" />
        </div>
        <div className="clearfix"></div>
      </div>
    )
  }
  renderGoToWorkspace() {
    const { location } = this.props;
    if(!location.state || !location.state.goTo) {
      return null;
    }
    const to = {
      pathname: location.state.goTo,
    };
    if(location.state.goTo !== '/') {
      to.state = { goTo: '/' };
    }
    return [
      <br key="1" />,
      <br key="2" />,
      <GoToWorkspace noTitle to={to} key="3" />
    ];
  }
  render() {
    const { location } = this.props;

    return (
      <div className="compatible-invite">
        <CompatibleHeader title="Your Workspace is ready!" subtitle="Invite your team to join in or download the app below." />
        {this.renderInviteForm()}
        {this.renderGoToWorkspace()}
      </div>
    );
  }
}

export default withRouter(CompatibleInvite)

// const { string } = PropTypes;

CompatibleInvite.propTypes = {};
