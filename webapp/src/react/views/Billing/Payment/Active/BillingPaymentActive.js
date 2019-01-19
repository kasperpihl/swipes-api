import React from 'react';
import useLoader from 'src/react/_hooks/useLoader';
import SW from './BillingPaymentActive.swiss';

export default function BillingPaymentActive() {
  const handleCardDetails = () => null;
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
        rounded
      />
    </SW.Wrapper>
  );
}
