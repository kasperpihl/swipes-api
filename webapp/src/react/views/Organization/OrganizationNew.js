import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ProfileOrgDelete from 'src/react/views/Profile/OrgDelete/ProfileOrgDelete';
import OrganizationHeader from 'src/react/views/Organization/Header/OrganizationHeader';
import OrganizationUser from 'src/react/views/Organization/User/OrganizationUser';
import TabBar from 'src/react/components/tab-bar/TabBar';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import SWView from 'src/react/app/view-controller/SWView';
import request from 'swipes-core-js/utils/request';
import SW from './OrganizationNew.swiss';

@navWrapper
@connect((state, props) => ({
  me: state.me,
  organization: state.organization.get(props.organizationId)
}))
export default class OrganizationNew extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showPendingInvites: false,
      emailInputValue: '',
      tabIndex: 0
    };
  }

  openDeleteModal = () => {
    const { openModal, organization } = this.props;

    openModal({
      component: ProfileOrgDelete,
      position: 'center',
      props: {
        orgName: organization.get('name'),
        orgId: organization.get('organization_id')
      }
    });
  };

  tabDidChange = index => {
    if (this.state.tabIndex !== index) {
      this.setState({ tabIndex: index });
    }
  };

  handleEmailChange = e => {
    this.setState({ emailInputValue: e.target.value });
  };

  handleSendInviteCached = email => {
    const { organization } = this.props;

    request('organization.inviteUser', {
      organization_id: organization.get('organization_id'),
      target_email: email
    });
  };

  handleRevokeInviteCached = email => {
    const { organization } = this.props;

    request('organization.inviteRevoke', {
      organization_id: organization.get('organization_id'),
      target_email: email
    });
  };

  togglePendingInvites = () => {
    const { showPendingInvites } = this.state;
    this.setState({ showPendingInvites: !showPendingInvites });
  };

  handleShowPendingInvites = () => {
    const { showPendingInvites } = this.state;
    const { organization } = this.props;

    if (showPendingInvites) {
      return (
        <SW.PendingInvites>
          {organization
            .get('pending_users')

            .map((ts, email) => (
              <SW.InviteItem key={email}>
                <SW.InviteEmail>{email}</SW.InviteEmail>
                <SW.EmailButton
                  title="Resend"
                  onClick={() => this.handleSendInviteCached(email)}
                />
                <SW.EmailButton
                  title="Revoke"
                  onClick={() => this.handleRevokeInviteCached(email)}
                />
              </SW.InviteItem>
            ))
            .toList()}
        </SW.PendingInvites>
      );
    }
    return null;
  };

  renderHeader = () => {
    const {
      organization,
      admin,
      activeSubscription,
      trialExpired,
      daysLeft,
      me
    } = this.props;
    return (
      <OrganizationHeader
        name={organization.get('name')}
        admin={organization.getIn(['users', me.get('user_id'), 'admin'])}
        activeSubscription={activeSubscription}
        trialExpired={trialExpired}
        daysLeft={daysLeft}
      />
    );
  };

  renderInviteInput = () => {
    const { emailInputValue } = this.state;

    return (
      <SW.InviteWrapper>
        <SW.InviteText>Invite others to join</SW.InviteText>
        <SW.InputWrapper>
          <SW.EmailInput
            type="email"
            placeholder="Email"
            autoFocus
            onChange={this.handleEmailChange}
          />
          <SW.SendButton
            title="Send Invite"
            onClick={() => this.handleSendInviteCached(emailInputValue)}
          />
        </SW.InputWrapper>
      </SW.InviteWrapper>
    );
  };

  renderPendingInvites = () => {
    const { showPendingInvites } = this.state;
    const { organization } = this.props;
    const pendingUsersArr = Object.keys(
      organization.get('pending_users').toJS()
    );

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

  renderTabBar = () => {
    return (
      <TabBar
        tabs={['Active Users', 'Inactive Users']}
        activeTab={this.state.tabIndex}
        delegate={this}
      />
    );
  };

  renderDeleteButton = () => {
    const { organization, me } = this.props;

    if (me.get('user_id') === organization.get('owner_id')) {
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
  render() {
    const { tabIndex } = this.state;
    const { organization } = this.props;
    const userStatus = tabIndex === 0 ? 'active' : 'disabled';

    return (
      <SWView header={this.renderHeader()}>
        <SW.Wrapper>
          {this.renderInviteInput()}
          {this.renderPendingInvites()}
          {this.handleShowPendingInvites()}
          {this.renderTabBar()}
          <SW.UsersWrapper>
            {organization
              .get('users')
              .filter(u => u.get('status') === userStatus)
              .map(u => (
                <OrganizationUser
                  key={u.get('user_id')}
                  user={u}
                  organization={organization}
                />
              ))
              .toList()}
          </SW.UsersWrapper>
          {/* {this.renderDeleteButton()} */}
        </SW.Wrapper>
      </SWView>
    );
  }
}
