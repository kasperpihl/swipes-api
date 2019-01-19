import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import SW from './ProfileOrgItem.swiss';

@navWrapper
@connect(state => ({
  me: state.me
}))
export default class ProfileOrgItem extends PureComponent {
  handleOpenOrganization = () => {
    const { organization, navPush, me } = this.props;
    const now = moment();
    const endingAt = moment(organization.get('trial_ending'));
    const expired = endingAt.isBefore(now);
    const daysLeft = endingAt.diff(now, 'days');

    navPush({
      id: 'Billing',
      title: 'Organization',
      props: {
        organizationId: organization.get('organization_id'),
        activeSubscription: organization.get('stripe_subscription_id'),
        trialExpired: expired
      }
    });
  };
  render() {
    const { organization, first } = this.props;

    return (
      <SW.Wrapper onClick={this.handleOpenOrganization} first={first}>
        <SW.OrgName>{organization.get('name')}</SW.OrgName>
        <SW.Options>
          <SW.UserAmount>
            {organization.get('users').size}{' '}
            {organization.get('users').size === 1 ? 'user' : 'users'}
          </SW.UserAmount>
        </SW.Options>
      </SW.Wrapper>
    );
  }
}
