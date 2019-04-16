import React, { useState } from 'react';

import SectionHeader from '_shared/SectionHeader/SectionHeader';
import Icon from '_shared/Icon/Icon';
import Spacing from '_shared/Spacing/Spacing';

import SW from './BillingPlan.swiss';

export default function BillingPlan({ onChange, value }) {
  const handleClickCached = plan => () => {
    if (plan === value) return;
    return onChange(plan);
  };

  return (
    <SW.Wrapper>
      <SectionHeader>
        <SW.Text>Select payment method</SW.Text>
      </SectionHeader>
      <SW.ToggleWrapper onClick={handleClickCached('yearly')}>
        <SW.Checkbox checked={value === 'yearly'} className="checkbox">
          {value === 'yearly' && (
            <Icon icon="Checkmark" fill="#FFFFFF" width="18" />
          )}
        </SW.Checkbox>
        <SW.TextWrapper>
          <SW.ToggleLabel>Pay Annually ($6/month per user)</SW.ToggleLabel>
          <Spacing height={3} />
          <SW.Subtitle>Cancel within 14 days for a full refund</SW.Subtitle>
        </SW.TextWrapper>
        <SW.StatusBox>Save 20%</SW.StatusBox>
      </SW.ToggleWrapper>
      <Spacing height={16} />
      <SW.ToggleWrapper onClick={handleClickCached('monthly')}>
        <SW.Checkbox checked={value === 'monthly'} className="checkbox">
          {value === 'monthly' && (
            <Icon icon="Checkmark" fill="#FFFFFF" width="18" />
          )}
        </SW.Checkbox>
        <SW.TextWrapper>
          <SW.ToggleLabel>Pay Monthly ($7.50/month per user)</SW.ToggleLabel>
          <Spacing height={3} />
          <SW.Subtitle>Cancel anytime</SW.Subtitle>
        </SW.TextWrapper>
      </SW.ToggleWrapper>
    </SW.Wrapper>
  );
}
