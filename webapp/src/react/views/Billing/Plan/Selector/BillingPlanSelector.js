import React, { useState } from 'react';
import BillingPlanConfirm from 'src/react/views/Billing/Plan/Confirm/BillingPlanConfirm';
import SW from './BillingPlanSelector.swiss';

const BillingPlanSelector = ({ onChange, value }) => {
  const handleClickCached = plan => () => {
    return onChange(plan);
    if (!currentPlan) {
      setPlan(plan);
    } else {
      props.openModal({
        component: BillingPlanConfirm,
        title: 'Change billing plan',
        position: 'center',
        props: {
          plan,
          organizationId: props.organization.get('organization_id'),
          currentPlan: currentPlan
        }
      });
    }
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
          billed anually{' '}
          <SW.SaveLabel className="save">You save 20%</SW.SaveLabel>
        </SW.Subtitle>
      </SW.Toggle>
    </SW.Wrapper>
  );
};

export default BillingPlanSelector;
