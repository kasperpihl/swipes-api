import React, { PureComponent } from 'react';
import CardHeader from 'src/react/components/CardHeader/CardHeader';
import SW from './OrganizationHeader.swiss';

export default class OrganizationHeader extends PureComponent {
  renderSubscriptionStatus = () => {
    const { admin, activeSubscription, trialExpired, daysLeft } = this.props;
    if (admin) {
      if (activeSubscription !== null) {
        return 'Active';
      } else {
        if (!trialExpired) {
          return `${daysLeft} ${daysLeft === 1 ? 'Day' : 'Days'} Left in Trial`;
        } else if (trialExpired) {
          return 'Trial Expired';
        }
        return 'Inactive';
      }
    } else if (!admin && !activeSubscription && trialExpired) {
      return 'Active';
    }
  };
  render() {
    const { name, trialExpired, activeSubscription } = this.props;
    return (
      <CardHeader title={name}>
        <SW.SubscriptionStatus>
          Your Subscription Status:
          <SW.Container>
            <SW.Indicator
              color={trialExpired ? '$red' : '$green'} //TODO: add in activeSubscription to check if user has active payment going on
            />
            {this.renderSubscriptionStatus()}
          </SW.Container>
        </SW.SubscriptionStatus>
      </CardHeader>
    );
  }
}
