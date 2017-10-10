import React, { PureComponent } from 'react';
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
  render() {
    return (
      <div className="compatible-invite">
        <CompatibleHeader title="New Org Title" subtitle="You have now created a new org, here you can invite others or download the app" />
        <CompatibleSubHeader title="Gather your whole team. Invite them here." />
        {this.renderInviteForm()}
        <GoToWorkspace />
      </div>
    );
  }
}

export default CompatibleInvite

// const { string } = PropTypes;

CompatibleInvite.propTypes = {};
