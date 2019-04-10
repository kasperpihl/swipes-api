import React, { useState } from 'react';
import SW from './BillingPaymentInput.swiss';
import SectionHeader from '_shared/SectionHeader/SectionHeader';
import Spacing from '_shared/Spacing/Spacing';

const style = {
  base: {
    color: '#32325d',
    lineHeight: '24px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

export default function BillingPaymentInput({
  label,
  billedAmount,
  activeUsersAmount,
  plan
}) {
  const [cardState, setCardState] = useState();

  const handleChange = cs => {
    setCardState(cs);
  };

  const errorMessage = cardState && cardState.error && cardState.error.message;

  return (
    <SW.Billing>
      <div>
        <SectionHeader>
          <SW.FormRowLabel htmlFor="card-element">{label}</SW.FormRowLabel>
        </SectionHeader>
        <Spacing height={24} />
        <SW.PriceWrapper>
          <SW.Amount>{`$${billedAmount}`}</SW.Amount>
          <SW.DueDate>due today</SW.DueDate>
        </SW.PriceWrapper>
        <Spacing height={6} />
        <SW.Subtitle>{`${
          plan === 'monthly' ? '$7.5' : '$6'
        } X ${activeUsersAmount} members X ${
          plan === 'monthly' ? '1 month' : '12 months'
        }`}</SW.Subtitle>
        <Spacing height={18} />
        <SW.ElementWrapper>
          <SW.StripeElement
            hidePostalCode
            style={style}
            onChange={handleChange}
          />
        </SW.ElementWrapper>
        <SW.CardError role="alert">{errorMessage}</SW.CardError>
      </div>
    </SW.Billing>
  );
}
