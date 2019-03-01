import React from 'react';
import useNav from 'src/react/_hooks/useNav';
import DayTracker from 'src/react/_components/DayTracker/DayTracker';
import orgGetBelonging from 'core/utils/org/orgGetBelonging';
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
  return (
    <SW.Wrapper onClick={handleClick}>
      <DayTracker
        compact
        startDate={plan.start_date}
        endDate={plan.end_date}
        maxWeeks={5}
      />
      <SW.TextWrapper>
        <SW.Title>{plan.title}</SW.Title>
        <SW.Subtitle>{orgGetBelonging(plan.owned_by)}</SW.Subtitle>
      </SW.TextWrapper>
    </SW.Wrapper>
  );
}
