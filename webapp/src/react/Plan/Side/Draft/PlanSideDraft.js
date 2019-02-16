import React from 'react';
import SW from './PlanSideDraft.swiss';
import PlanSideAlert from 'src/react/Plan/Side/Alert/PlanSideAlert';
import PlanSidePicker from 'src/react/Plan/Side/Picker/PlanSidePicker';
import SideHeader from 'src/react/_components/SideHeader/SideHeader';
import request from 'swipes-core-js/utils/request';
import useLoader from 'src/react/_hooks/useLoader';
import Button from 'src/react/_components/Button/Button';

export default function PlanSideDraft({ plan }) {
  const loader = useLoader();
  const handleStart = async () => {
    loader.set('StartButton');
    const res = await request('plan.start', {
      plan_id: plan.get('plan_id')
    });
    if (res.ok) {
      loader.clear('StartButton');
    } else {
      loader.error('StartButton', res.error, 3000);
    }
  };
  return (
    <>
      <SideHeader title={plan.get('task_counter')} subtitle="Tasks selected" />
      <PlanSidePicker plan={plan} />
      <PlanSideAlert
        type="draft"
        title="This is a draft - Select some tasks and press start"
      >
        <Button.Standard
          title="Start"
          icon="Comment"
          onClick={handleStart}
          status={loader.get('StartButton')}
        />
      </PlanSideAlert>
    </>
  );
}
