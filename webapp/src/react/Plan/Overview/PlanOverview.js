import React from 'react';
import RequestLoader from '_shared/RequestLoader/RequestLoader';
import CardContent from '_shared/Card/Content/CardContent';
import CardHeader from '_shared/Card/Header/CardHeader';
import Button from '_shared/Button/Button';

import planGetTitle from 'core/utils/plan/planGetTitle';

import PlanSelect from 'src/react/Plan/Select/PlanSelect';
import PlanFilter from 'src/react/Plan/Filter/PlanFilter';
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

  const title = planGetTitle(plan);

  return (
    <CardContent
      noframe
      header={
        <CardHeader padding={30} title={title} subtitle={subtitle} separator>
          <Button icon="ThreeDots" />
        </CardHeader>
      }
    >
      {plan.started_at ? (
        <PlanFilter plan={plan} />
      ) : (
        <PlanSelect plan={plan} />
      )}
    </CardContent>
  );
}
