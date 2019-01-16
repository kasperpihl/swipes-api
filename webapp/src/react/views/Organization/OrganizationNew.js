import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ProfileOrgDelete from 'src/react/views/Profile/OrgDelete/ProfileOrgDelete';
import OrganizationHeader from 'src/react/views/Organization/Header/OrganizationHeader';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import SW from './OrganizationNew.swiss';

@navWrapper
@connect(state => ({
  me: state.me
}))
export default class OrganizationNew extends PureComponent {
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
  render() {
    const {
      organizationName,
      admin,
      activeSubscription,
      trialExpired,
      daysLeft
    } = this.props;

    return (
      <SW.Wrapper>
        <OrganizationHeader
          name={organizationName}
          admin={admin}
          activeSubscription={activeSubscription}
          trialExpired={trialExpired}
          daysLeft={daysLeft}
        />
        <SW.InviteWrapper>
          <SW.InviteText>Invite others to join</SW.InviteText>
          <SW.InputWrapper>
            <SW.EmailInput type="email" placeholder="Email" />
            <SW.SendButton title="Send Invite" />
          </SW.InputWrapper>
        </SW.InviteWrapper>

        {this.renderDeleteButton()}
      </SW.Wrapper>
    );
  }
}
