import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import { styleElement } from 'swiss-react';
import { Link } from 'react-router-dom';
import Icon from 'Icon';
import RotateLoader from 'components/loaders/RotateLoader';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import CompatibleSubHeader from 'compatible/components/subheader/CompatibleSubHeader';
import DownloadForDevice from 'compatible/components/download-for-device/DownloadForDevice';
import HOCLogoutButton from 'compatible/components/logout-button/HOCLogoutButton';
import styles from './styles/NotSupported.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Illustration = styleElement('img', styles.Illustration);
const EmptySpaceBlock = styleElement('div', styles.EmptySpaceBlock);
const OptionTitle = styleElement('div', styles.OptionTitle);
const StyledLink = styleElement('a', styles.StyledLink);
const Description = styleElement('div', styles.Description);
const NewLink = styleElement(Link, styles.NewLink);

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
        <Description>{desc}</Description>
        <OptionTitle>
          <StyledLink onClick={this.onLeaveOrg}>{buttonTitle}</StyledLink>
          {isLoading && isLoading('delete') && <RotateLoader size={19} />}
        </OptionTitle>
      </div>
    )
  }
  renderActions() {
    const { organization } = this.props;

    return (
      <div className="not-supported__actions">
        <div className="not-supported__option-wrapper">
          <Description>
            {`Invite more people to ${organization.get('name')}. Gather your whole team.`}
          </Description>
          <OptionTitle>
            <NewLink to="/invite">Invite people</NewLink>
          </OptionTitle>
        </div>
        {this.renderLeaveOrDelete()}
      </div>
    )
  }
  render() {
    return (
      <Wrapper>
        <CompatibleHeader title="Please download our apps to get started."/>
        <DownloadForDevice />
        <EmptySpaceBlock />
        <CompatibleSubHeader title="What else can I do?" />
        {this.renderActions()}
        <HOCLogoutButton />
      </Wrapper>
    );
  }
}

export default NotSupported;
