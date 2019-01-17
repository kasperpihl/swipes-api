import React, { PureComponent } from 'react';
import CardHeader from 'src/react/components/CardHeader/CardHeader';
import SW from './OrganizationHeader.swiss';

export default class OrganizationHeader extends PureComponent {
  renderSubscriptionStatus = () => {
    const { activeSubscription, trialExpired } = this.props;
    if (activeSubscription !== null || !trialExpired) {
      return 'Active';
    } else {
      return 'Inactive';
    }
  };
  render() {
    const { name, trialExpired } = this.props;
    return (
      <CardHeader title={name}>
        <SW.SubscriptionStatus>
          Your Subscription Status:
          <SW.Container>
            <SW.Indicator
              color={trialExpired ? '$red' : '$green'} // TODO: add condition to check if stripe sub is active
            />
            {this.renderSubscriptionStatus()}
          </SW.Container>
        </SW.SubscriptionStatus>
      </CardHeader>
    );
  }
}
