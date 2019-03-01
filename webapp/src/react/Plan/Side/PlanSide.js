import React from 'react';
import SW from './PlanSide.swiss';
import PlanSideDraft from './Draft/PlanSideDraft';
import PlanSideRunning from './Running/PlanSideRunning';
// import PlanSideCompleted from './Completed/PlanSideCompleted';

export default function PlanSide({ plan }) {
  let SideComp = PlanSideDraft;
  if (plan.started_at) {
    SideComp = PlanSideRunning;
  }

  return (
    <SW.Wrapper>
      <SideComp plan={plan} />
    </SW.Wrapper>
  );
}
