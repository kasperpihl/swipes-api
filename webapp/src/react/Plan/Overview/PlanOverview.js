import React from 'react';
import SW from './PlanOverview.swiss';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';
import CardContent from 'src/react/_components/Card/Content/CardContent';
import CardHeader from 'src/react/_components/Card/Header/CardHeader';
import Button from 'src/react/_components/Button/Button';
import PlanSide from 'src/react/Plan/Side/PlanSide';
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

  console.log(req.result.plan);
  return (
    <CardContent
      noframe
      header={
        <CardHeader padding={30} title={plan.title} subtitle={subtitle}>
          <Button title="See my tasks" />
          <Button icon="ThreeDots" />
        </CardHeader>
      }
    >
      <SW.Wrapper>
        <PlanSide plan={plan} />
        <PlanFilter plan={plan} />
      </SW.Wrapper>
    </CardContent>
  );
}
