import React from 'react';
import SW from './PlanSide.swiss';
import PlanSideDraft from './Draft/PlanSideDraft';
// import PlanSideRunning from './Running/PlanSideRunning';
// import PlanSideCompleted from './Completed/PlanSideCompleted';

export default function PlanSide({ plan }) {
  let SideComp;

  return (
    <SW.Wrapper>
      <PlanSideDraft plan={plan} />
    </SW.Wrapper>
  );
}
