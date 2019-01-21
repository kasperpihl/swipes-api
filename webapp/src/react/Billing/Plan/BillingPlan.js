import React, { useState } from 'react';
import SW from './BillingPlan.swiss';

export default function BillingPlan({ onChange, value }) {
  const handleClickCached = plan => () => {
    if (plan === value) return;
    return onChange(plan);
  };

  return (
    <SW.Wrapper>
      <SW.Toggle
        selected={value === 'monthly'}
        onClick={handleClickCached('monthly')}
      >
        <SW.Price>$7.50</SW.Price>
        <SW.PriceLabel>per user a month</SW.PriceLabel>
        <SW.Subtitle>billed monthly</SW.Subtitle>
      </SW.Toggle>
      <SW.Toggle
        selected={value === 'yearly'}
        onClick={handleClickCached('yearly')}
      >
        <SW.Price>$6</SW.Price>
        <SW.PriceLabel>per user a month</SW.PriceLabel>
        <SW.Subtitle>
          billed anually <SW.SaveLabel>You save 20%</SW.SaveLabel>
        </SW.Subtitle>
      </SW.Toggle>
    </SW.Wrapper>
  );
}
