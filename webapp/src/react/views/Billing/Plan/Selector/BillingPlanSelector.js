import React from 'react';
import SW from './BillingPlanSelector.swiss';

const BillingPlanSelector = props => {
  return (
    <SW.Toggle>
      <SW.ToggleSection
        first={billingStatus === 'monthly' ? true : false}
        onClick={this.onSwitchPlanCached('monthly')}
      >
        <SW.TogglePrice>$7.50</SW.TogglePrice>
        <SW.ToggleLabel>per user a month</SW.ToggleLabel>
        <SW.ToggleSubLabel>billed monthly</SW.ToggleSubLabel>
      </SW.ToggleSection>
      <SW.ToggleSection
        first={billingStatus === 'monthly' ? true : false}
        onClick={this.onSwitchPlanCached('yearly')}
      >
        <SW.TogglePrice>$6</SW.TogglePrice>
        <SW.ToggleLabel>per user a month</SW.ToggleLabel>
        <SW.ToggleSubLabel>
          billed anually{' '}
          <SW.SaveLabel className="save">You save 20%</SW.SaveLabel>
        </SW.ToggleSubLabel>
      </SW.ToggleSection>
    </SW.Toggle>
  );
};

export default BillingPlanSelector;
