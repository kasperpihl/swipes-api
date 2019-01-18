import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import OrganizationDelete from 'src/react/views/Organization/Delete/OrganizationDelete.js';
import OrganizationHeader from 'src/react/views/Organization/Header/OrganizationHeader';
import OrganizationUser from 'src/react/views/Organization/User/OrganizationUser';
import OrganizationInviteInput from 'src/react/views/Organization/Invite/Input/OrganizationInviteInput';
import OrganizationPendingInvites from 'src/react/views/Organization/Invite/PendingInvites/OrganizationPendingInvites';
import SW from './OrganizationNew.swiss';

import navWrapper from 'src/react/app/view-controller/NavWrapper';
import propsOrPop from 'src/utils/propsOrPop';
import SWView from 'src/react/app/view-controller/SWView';

@navWrapper
@connect((state, props) => ({
  me: state.me,
  organization: state.organization.get(props.organizationId)
}))
@propsOrPop('organization')
export default class OrganizationNew extends PureComponent {
  static sizes = () => [540];
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0
    };
  }

  openDeleteModal = () => {
    const { openModal, organization } = this.props;

    openModal({
      component: OrganizationDelete,
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
        orgId={organization.get('organization_id')}
        admin={organization.getIn(['users', me.get('user_id'), 'admin'])}
        activeSubscription={activeSubscription}
        trialExpired={trialExpired}
        daysLeft={daysLeft}
      />
    );
  };

  renderTabBar = () => {
    return (
      <SW.TabBar
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
    const { organization, me } = this.props;
    const userStatus = tabIndex === 0 ? 'active' : 'disabled';

    return (
      <SWView header={this.renderHeader()}>
        <SW.Wrapper>
          <OrganizationInviteInput
            organizationId={organization.get('organization_id')}
          />
          <OrganizationPendingInvites organization={organization} />
          {this.renderTabBar()}
          <SW.UsersWrapper>
            {organization
              .get('users')
              .filter(u => u.get('status') === userStatus)
              .map(u => (
                <OrganizationUser
                  key={u.get('user_id')}
                  user={u}
                  organizationId={organization.get('organization_id')}
                  me={me}
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
