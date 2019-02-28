import React from 'react';
import { fromJS } from 'immutable';
import SW from './PlanOverview.swiss';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';
import CardContent from 'src/react/_components/Card/Content/CardContent';
import CardHeader from 'src/react/_components/Card/Header/CardHeader';
import Button from 'src/react/_components/Button/Button';
import PlanSide from 'src/react/Plan/Side/PlanSide';
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

  const plan = fromJS(req.result.plan);

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
        <CardHeader padding={30} title={plan.get('title')} subtitle={subtitle}>
          <Button title="See my tasks" />
          <Button icon="Chat" />
          <Button icon="ThreeDots" />
        </CardHeader>
      }
    >
      <SW.Wrapper>
        <PlanSide plan={plan} />
        <SW.TasksWrapper>Here will be many tasks</SW.TasksWrapper>
      </SW.Wrapper>
    </CardContent>
  );
}
