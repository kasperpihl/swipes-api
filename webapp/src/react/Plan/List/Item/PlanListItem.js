import React from 'react';
import useNav from 'src/react/_hooks/useNav';
import DayTracker from 'src/react/_components/DayTracker/DayTracker';
import planGetTitle from 'core/utils/plan/planGetTitle';
import teamGetBelonging from 'core/utils/team/teamGetBelonging';
import SW from './PlanListItem.swiss';

export default function PlanListItem({ plan }) {
  const nav = useNav();
  const handleClick = () => {
    nav.push({
      screenId: 'PlanOverview',
      crumbTitle: 'Plan',
      uniqueId: plan.plan_id,
      props: {
        planId: plan.plan_id
      }
    });
  };

  const title = planGetTitle(plan);

  return (
    <SW.Wrapper onClick={handleClick}>
      <DayTracker
        compact
        startDate={plan.start_date}
        endDate={plan.end_date}
        maxWeeks={5}
        showCurrentDateMarker
      />
      <SW.TextWrapper>
        <SW.Title>{title}</SW.Title>
        <SW.Subtitle>{teamGetBelonging(plan.owned_by)}</SW.Subtitle>
      </SW.TextWrapper>
    </SW.Wrapper>
  );
}
