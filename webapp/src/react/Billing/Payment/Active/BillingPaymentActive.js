import React from 'react';

import BillingPaymentModal from 'src/react/Billing/Payment/Modal/BillingPaymentModal';

import Button from 'src/react/_components/Button/Button';

import SW from './BillingPaymentActive.swiss';
import Spacing from '_shared/Spacing/Spacing';

export default function BillingPaymentActive({ openModal, team }) {
  const handleCardDetails = () => {
    openModal(BillingPaymentModal, {
      teamId: team.get('team_id')
    });
  };
  return (
    <SW.Wrapper>
      <SW.Title>Thank you for your purchase.</SW.Title>
      <Spacing height={9} />
      <SW.StatusWrapper>
        <SW.StatusLabel>Your subscription status is:</SW.StatusLabel>
        <SW.Status>Active</SW.Status>
      </SW.StatusWrapper>
      <Spacing height={9} />
      <Button title="Change card details" onClick={handleCardDetails} border />
    </SW.Wrapper>
  );
}
