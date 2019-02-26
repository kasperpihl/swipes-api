import React from 'react';
import CardHeader from 'src/react/_components/Card/Header/CardHeader';
import SW from './BillingHeader.swiss';

const BillingHeader = ({ organization }) => {
  const hasStripe = !!organization.get('stripe_subscription_id');
  const status = hasStripe ? 'Active' : 'Inactive';
  const title = `Billing: ${organization.get('name')}`;

  return (
    <CardHeader title={title}>
      <SW.StatusWrapper>
        <SW.StatusLabel>Your subscription status is:</SW.StatusLabel>
        <SW.Status active={!!hasStripe}>{status}</SW.Status>
      </SW.StatusWrapper>
    </CardHeader>
  );
};

export default BillingHeader;
