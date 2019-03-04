import React from 'react';
import request from 'core/utils/request';
import useLoader from 'src/react/_hooks/useLoader';

import Button from 'src/react/_components/Button/Button';

import PlanSidePicker from 'src/react/Plan/Side/Picker/PlanSidePicker';
import SideHeader from 'src/react/_components/SideHeader/SideHeader';

import SW from './PlanSideDraft.swiss';

export default function PlanSideDraft({ plan, selectedCounter }) {
  const loader = useLoader();
  const handleStart = async () => {
    loader.set('StartButton');
    const res = await request('plan.start', {
      plan_id: plan.plan_id
    });
    if (res.ok) {
      loader.clear('StartButton');
    } else {
      loader.error('StartButton', res.error, 3000);
    }
  };
  return (
    <SW.Wrapper>
      <SideHeader title={selectedCounter} subtitle="Tasks selected" />
      <PlanSidePicker plan={plan} />
      <Button
        title="Start"
        icon="Comment"
        onClick={handleStart}
        status={loader.get('StartButton')}
      />
    </SW.Wrapper>
  );
}
