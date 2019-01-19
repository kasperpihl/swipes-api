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

    navPush({
      id: 'Organization',
      title: 'Organization',
      props: {
        organizationId: organization.get('organization_id')
      }
    });
  };

  renderSubscriptionStatus = () => {
    const { organization } = this.props;
    const now = moment();
    const endingAt = moment(organization.get('trial_ending'));
    const trialExpired = endingAt.isBefore(now);
    const daysLeft = endingAt.diff(now, 'days');

    if (organization.get('stripe_subscription_id')) {
      return;
    }
    if (daysLeft > 0) {
      return (
        <SW.OrganizationInfo>
          {daysLeft > 0
            ? `Trial (${daysLeft} ${daysLeft > 1 ? 'days' : 'day'} left)`
            : 'Trial Expired'}
        </SW.OrganizationInfo>
      );
    } else if (trialExpired) {
      return <SW.OrganizationInfo>Trial Expired</SW.OrganizationInfo>;
    } else if (false) {
      return <SW.OrganizationInfo error>Payment Error</SW.OrganizationInfo>;
    } // TODO: add payment error conditional rendering whenever that is implemented
  };
  render() {
    const { organization, first } = this.props;

    return (
      <SW.Wrapper onClick={this.handleOpenOrganization} first={first}>
        <SW.OrgName>{organization.get('name')}</SW.OrgName>
        <SW.Options>
          {this.renderSubscriptionStatus()}
          <SW.OrganizationInfo right>
            {organization.get('users').size}{' '}
            {organization.get('users').size === 1 ? 'user' : 'users'}
          </SW.OrganizationInfo>
        </SW.Options>
      </SW.Wrapper>
    );
  }
}
