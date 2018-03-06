import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';

import { Link } from 'react-router-dom';
import Icon from 'Icon';
import RotateLoader from 'components/loaders/RotateLoader';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import CompatibleSubHeader from 'compatible/components/subheader/CompatibleSubHeader';
import DownloadForDevice from 'compatible/components/download-for-device/DownloadForDevice';
import HOCLogoutButton from 'compatible/components/logout-button/HOCLogoutButton';
import './styles/not-supported.scss';

class NotSupported extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onLeaveOrg');
    // this.callDelegate.bindAll('onLala');
  }
  renderLeaveOrDelete() {
    const { me, organization, isLoading } = this.props;
    const isOwner = me.get('id') === organization.get('owner_id');
    let desc = `Leave the organization: ${organization.get('name')}. You will be available to join a new organization.`;
    let buttonTitle = 'Leave organization'; 

    if(isOwner) {
      desc = `Delete your organization ${organization.get('name')}. This will throw out all the current users from the organization as well.`;
      buttonTitle = 'Delete organization';
    }

    return (
      <div className="not-supported__option-wrapper">
        <div className="not-supported__desc">{desc}</div>
        <div className="not-supported__option-title">
          <a className="not-supported__link" onClick={this.onLeaveOrg}>{buttonTitle}</a>
          {isLoading && isLoading('delete') && <RotateLoader size={19} />}
        </div>
      </div>
    )
  }
  renderActions() {
    const { organization } = this.props;

    return (
      <div className="not-supported__actions">
        <div className="not-supported__option-wrapper">
          <div className="not-supported__desc">
            {`Invite more people to ${organization.get('name')}. Gather your whole team.`}
          </div>
          <div className="not-supported__option-title">
            <Link to="/invite" className="not-supported__link">Invite people</Link>
          </div>
        </div>
        {this.renderLeaveOrDelete()}
      </div>
    )
  }
  render() {
    return (
      <div className="not-supported">
        <CompatibleHeader title="Please download our apps to get started."/>
        <DownloadForDevice />
        <div className="not-supported__empty-space-block" />
        <CompatibleSubHeader title="What else can I do?" />
        {this.renderActions()}
        <HOCLogoutButton />
      </div>
    );
  }
}

export default NotSupported

// const { string } = PropTypes;

NotSupported.propTypes = {};
