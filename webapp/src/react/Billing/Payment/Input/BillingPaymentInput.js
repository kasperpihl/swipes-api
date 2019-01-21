import React, { useState } from 'react';
import SW from './BillingPaymentInput.swiss';

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

export default function BillingPaymentInput({ label }) {
  const [cardState, setCardState] = useState();

  const handleChange = cs => {
    setCardState(cs);
  };

  const errorMessage = cardState && cardState.error && cardState.error.message;

  return (
    <SW.Billing>
      <div>
        <SW.FormRowLabel htmlFor="card-element">{label}</SW.FormRowLabel>
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
