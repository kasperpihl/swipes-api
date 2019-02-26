import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import OrganizationHeader from 'src/react/Organization/Header/OrganizationHeader';
import OrganizationUser from 'src/react/Organization/User/OrganizationUser';
import OrganizationInviteInput from 'src/react/Organization/Invite/Input/OrganizationInviteInput';
import OrganizationPendingInvites from 'src/react/Organization/Invite/PendingInvites/OrganizationPendingInvites';
import SW from './Organization.swiss';

import propsOrPop from 'src/react/_hocs/propsOrPop';
import CardContent from 'src/react/_components/Card/Content/CardContent';

@connect((state, props) => ({
  meInOrg: state.organizations.getIn([
    props.organizationId,
    'users',
    state.me.get('user_id')
  ]),
  organization: state.organizations.get(props.organizationId)
}))
@propsOrPop('organization')
export default class Organization extends PureComponent {
  static sizes = [540];
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0
    };
  }

  handleTabChange = index => {
    if (this.state.tabIndex !== index) {
      this.setState({ tabIndex: index });
    }
  };

  renderHeader = () => {
    const {
      organization,
      activeSubscription,
      trialExpired,
      daysLeft,
      meInOrg
    } = this.props;
    return (
      <OrganizationHeader
        name={organization.get('name')}
        organization={organization}
        meInOrg={meInOrg}
        admin={organization.getIn(['users', meInOrg.get('user_id'), 'admin'])}
        activeSubscription={activeSubscription}
        trialExpired={trialExpired}
        daysLeft={daysLeft}
      />
    );
  };

  renderTabBar = () => {
    const { organization } = this.props;
    const disabledUsersAmount = organization
      .get('users')
      .filter(u => u.get('status') === 'disabled').size;

    let tabs = ['Active users'];
    if (disabledUsersAmount > 0) {
      tabs.push('Disabled users');
    }
    return (
      <SW.TabBar
        tabs={tabs}
        value={this.state.tabIndex}
        onChange={this.handleTabChange}
      />
    );
  };

  render() {
    const { tabIndex } = this.state;
    const { organization, meInOrg } = this.props;
    const userStatus = tabIndex === 0 ? 'active' : 'disabled';

    return (
      <CardContent header={this.renderHeader()}>
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
                  meInOrg={meInOrg}
                />
              ))
              .toList()}
          </SW.UsersWrapper>
        </SW.Wrapper>
      </CardContent>
    );
  }
}
