import React from 'react';
import useLoader from 'src/react/_hooks/useLoader';
import request from 'swipes-core-js/utils/request';
import Button from 'src/react/components/Button/Button';
import SW from './BillingPlanConfirm.swiss';

const BillingPlanConfirm = ({
  hideModal,
  plan,
  organizationId,
  currentPlan
}) => {
  const loader = useLoader();

  const handleConfirm = e => {
    loader.set('confirm');

    request('billing.updatePlan', { plan, organizationId }).then(res => {
      if (res.ok) {
        loader.success('confirm', 'Changed', 1500, () => {
          if (hideModal) {
            hideModal();
          }
        });
      } else {
        loader.error('confirm', '!Error', 3000);
      }
    });
  };

  const content = `You are about to change your billing plan from ${currentPlan} to ${plan}. Any unused time from the current subscription will be converted in credits that will be used for future payments.
    
    Click 'Confirm’ to change the plan.`;

  return (
    <SW.Wrapper>
      <SW.ComposerWrapper>{content}</SW.ComposerWrapper>
      <SW.ActionBar>
        <Button
          title="Confirm"
          onClick={handleConfirm}
          {...loader.get('confirm')}
        />
      </SW.ActionBar>
    </SW.Wrapper>
  );
};

export default BillingPlanConfirm;
