import React from 'react';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';
import CardContent from 'src/react/_components/Card/Content/CardContent';
import CardHeader from 'src/react/_components/Card/Header/CardHeader';
import Button from 'src/react/_components/Button/Button';
import PlanSelect from 'src/react/Plan/Select/PlanSelect';
import useUpdate from 'core/react/_hooks/useUpdate';
import useRequest from 'core/react/_hooks/useRequest';

PlanOverview.sizes = [750];
export default function PlanOverview({ planId }) {
  const req = useRequest('plan.get', {
    plan_id: planId
  });

  useUpdate('plan', plan => {
    if (plan.plan_id === planId) {
      req.merge('plan', plan);
    }
  });

  if (req.error || req.loading) {
    return <RequestLoader req={req} />;
  }

  const plan = req.result.plan;

  const subtitle = {
    ownedBy: req.result.plan.owned_by,
    members: ['U5JXWRUJE'],
    privacy: 'public'
  };

  return (
    <CardContent
      noframe
      header={
        <CardHeader padding={30} title={plan.title} subtitle={subtitle}>
          <Button icon="ThreeDots" />
        </CardHeader>
      }
    >
      <PlanSelect plan={plan} />
    </CardContent>
  );
}
