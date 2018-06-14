import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import RotateLoader from 'components/loaders/RotateLoader';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import CompatibleSubHeader from 'compatible/components/subheader/CompatibleSubHeader';
import DownloadForDevice from 'compatible/components/download-for-device/DownloadForDevice';
import HOCLogoutButton from 'compatible/components/logout-button/HOCLogoutButton';
import SW from './styles/NotSupported.swiss';

class NotSupported extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onLeaveOrg');
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
        <SW.Description>{desc}</SW.Description>
        <SW.OptionTitle>
          <SW.StyledLink onClick={this.onLeaveOrg}>{buttonTitle}</SW.StyledLink>
          {isLoading && isLoading('delete') && <RotateLoader size={19} />}
        </SW.OptionTitle>
      </div>
    )
  }
  renderActions() {
    const { organization } = this.props;

    return (
      <div className="not-supported__actions">
        <div className="not-supported__option-wrapper">
          <SW.Description>
            {`Invite more people to ${organization.get('name')}. Gather your whole team.`}
          </SW.Description>
          <SW.OptionTitle>
            <SW.NewLink to="/invite">Invite people</SW.NewLink>
          </SW.OptionTitle>
        </div>
        {this.renderLeaveOrDelete()}
      </div>
    )
  }
  render() {
    return (
      <SW.Wrapper>
        <CompatibleHeader title="Please download our apps to get started."/>
        <DownloadForDevice />
        <EmptySpaceBlock />
        <CompatibleSubHeader title="What else can I do?" />
        {this.renderActions()}
        <HOCLogoutButton />
      </SW.Wrapper>
    );
  }
}

export default NotSupported;
