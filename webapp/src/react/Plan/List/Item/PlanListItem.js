import React from 'react';
import useNav from 'src/react/_hooks/useNav';
import DayTracker from 'src/react/_components/DayTracker/DayTracker';
import orgGetBelonging from 'swipes-core-js/utils/org/orgGetBelonging';
import SW from './PlanListItem.swiss';

export default function PlanListItem({ plan }) {
  const nav = useNav();
  const handleClick = () => {
    nav.push({
      screenId: 'PlanOverview',
      crumbTitle: 'Plan',
      uniqueId: plan.get('plan_id'),
      props: {
        planId: plan.get('plan_id')
      }
    });
  };
  return (
    <SW.Wrapper onClick={handleClick}>
      <DayTracker
        startDate={plan.get('start_date')}
        endDate={plan.get('end_date')}
        maxWeeks={5}
      />
      <SW.TextWrapper>
        <SW.Title>{plan.get('title')}</SW.Title>
        <SW.Subtitle>{orgGetBelonging(plan.get('owned_by'))}</SW.Subtitle>
        <SW.TaskCounter>{plan.get('task_counter')}</SW.TaskCounter>
      </SW.TextWrapper>
    </SW.Wrapper>
  );
}
