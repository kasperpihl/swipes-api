import React from 'react';

import SW from './BillingHeader.swiss';

const BillingHeader = ({ team }) => {
  const hasStripe = !!team.get('stripe_subscription_id');

  return <CardHeader title={title} />;
};

export default BillingHeader;
