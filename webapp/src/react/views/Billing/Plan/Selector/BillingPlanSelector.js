import React, { useState } from 'react';
import BillingPlanConfirm from 'src/react/views/Billing/Plan/Confirm/BillingPlanConfirm';
import SW from './BillingPlanSelector.swiss';

const BillingPlanSelector = props => {
  const currentPlan = null; // TODO: Make this real from db...
  const [planState, setPlan] = useState('monthly');

  const handleClickCached = plan => {
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
    <SW.Toggle>
      <SW.ToggleSection
        first={billingStatus === 'monthly' ? true : false}
        onClick={handleClickCached('monthly')}
      >
        <SW.TogglePrice>$7.50</SW.TogglePrice>
        <SW.ToggleLabel>per user a month</SW.ToggleLabel>
        <SW.ToggleSubLabel>billed monthly</SW.ToggleSubLabel>
      </SW.ToggleSection>
      <SW.ToggleSection
        first={billingStatus === 'monthly' ? true : false}
        onClick={handleClickCached('yearly')}
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
