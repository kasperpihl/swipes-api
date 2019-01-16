import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ProfileOrgDelete from 'src/react/views/Profile/OrgDelete/ProfileOrgDelete';
import OrganizationHeader from 'src/react/views/Organization/Header/OrganizationHeader';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import SWView from 'src/react/app/view-controller/SWView';
import SW from './OrganizationNew.swiss';

const invitedemail = [
  'petar.dyakov@icloud.com',
  'petar@swipesapp.com',
  'kasper@swipesapp.com',
  'tihomir@swipesapp.com',
  'valentina@swipesapp.com',
  'stefan@swipesapp.com',
  'elena@swipesapp.com'
];
@navWrapper
@connect(state => ({
  me: state.me
}))
export default class OrganizationNew extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showPendingInvites: false
    };
  }

  openDeleteModal = () => {
    const { openModal, ownerId, organizationName } = this.props;

    openModal({
      component: ProfileOrgDelete,
      position: 'center',
      props: {
        orgName: organizationName,
        orgId: ownerId
      }
    });
  };

  togglePendingInvites = () => {
    const { showPendingInvites } = this.state;
    this.setState({ showPendingInvites: !showPendingInvites });
  };

  handleShowPendingInvites = () => {
    const { showPendingInvites } = this.state;

    if (showPendingInvites) {
      return (
        <SW.PendingInvites>
          {invitedemail.map((e, i) => (
            <SW.InviteItem key={i}>
              <SW.InviteEmail>{e}</SW.InviteEmail>
              <SW.EmailButton title="Resend" onClick={this.handleResendEmail} />
              <SW.EmailButton
                title="Revoke"
                onClick={this.handleRevokeInvite}
              />
            </SW.InviteItem>
          ))}
        </SW.PendingInvites>
      );
    }
    return null;
  };

  renderInviteInput = () => {
    return (
      <SW.InviteWrapper>
        <SW.InviteText>Invite others to join</SW.InviteText>
        <SW.InputWrapper>
          <SW.EmailInput type="email" placeholder="Email" autoFocus />
          <SW.SendButton title="Send Invite" />
        </SW.InputWrapper>
      </SW.InviteWrapper>
    );
  };

  renderPendingInvites = () => {
    const { showPendingInvites } = this.state;
    const { pendingUsers } = this.props;
    const pendingUsersArr = Object.keys(pendingUsers.toJS());

    return (
      <SW.PendingInvitesWrapper>
        <SW.SectionTitle onClick={this.togglePendingInvites}>
          <SW.Icon
            icon="ArrowRightFull"
            width="24"
            height="24"
            showInvites={showPendingInvites}
          />
          Pending invitations {pendingUsersArr.length}
        </SW.SectionTitle>
      </SW.PendingInvitesWrapper>
    );
  };

  renderDeleteButton = () => {
    const { ownerId, me } = this.props;

    if (me.get('user_id') === ownerId) {
      return (
        <SW.Button
          icon="Delete"
          title="Delete"
          onClick={this.openDeleteModal}
        />
      );
    }
    return null;
  };
  renderHeader = () => {
    const {
      organizationName,
      admin,
      activeSubscription,
      trialExpired,
      daysLeft
    } = this.props;
    return (
      <OrganizationHeader
        name={organizationName}
        admin={admin}
        activeSubscription={activeSubscription}
        trialExpired={trialExpired}
        daysLeft={daysLeft}
      />
    );
  };
  render() {
    return (
      <SWView header={this.renderHeader()}>
        <SW.Wrapper>
          {this.renderInviteInput()}
          {this.renderPendingInvites()}
          {this.handleShowPendingInvites()}
          {this.renderDeleteButton()}
        </SW.Wrapper>
      </SWView>
    );
  }
}
