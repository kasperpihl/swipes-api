import React from 'react';
import SW from './PlanSide.swiss';
import Button from 'src/react/_components/Button/Button';

export default function PlanSide({ plan }) {
  const handleStart = () => {
    console.log('pressed start');
  };
  return (
    <SW.SidebarWrapper>
      <SW.TasksTracker>
        <SW.BigNumber>{plan.get('task_counter')}</SW.BigNumber>
      </SW.TasksTracker>
      <SW.Text>Tasks selected</SW.Text>
      {plan.get('state') === 'draft' && (
        <Button.Standard title="Start" icon="Comment" onClick={handleStart} />
      )}
    </SW.SidebarWrapper>
  );
}
