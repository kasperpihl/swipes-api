import React from 'react';
import SideHeader from 'src/react/_components/SideHeader/SideHeader';

export default function PlanSideRunning({ plan }) {
  return (
    <>
      <SideHeader title={plan.get('task_counter')} subtitle="Tasks selected" />
    </>
  );
}
