import React from 'react';
import BillingPaymentModal from 'src/react/Billing/Payment/Modal/BillingPaymentModal';
import SW from './BillingPaymentActive.swiss';

export default function BillingPaymentActive({ openModal, team }) {
  const handleCardDetails = () => {
    openModal(BillingPaymentModal, {
      teamId: team.get('team_id')
    });
  };
  return (
    <SW.Wrapper>
      <SW.Title>Thank you for your purchase.</SW.Title>
      <SW.StatusWrapper>
        <SW.StatusLabel>Your subscription status is:</SW.StatusLabel>
        <SW.Status>Active</SW.Status>
      </SW.StatusWrapper>
      <SW.ChangeDetailsButton
        title="Change card details"
        onClick={handleCardDetails}
      />
    </SW.Wrapper>
  );
}
