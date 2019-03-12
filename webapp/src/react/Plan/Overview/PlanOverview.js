import React from 'react';
import RequestLoader from '_shared/RequestLoader/RequestLoader';
import CardContent from '_shared/Card/Content/CardContent';
import CardHeader from '_shared/Card/Header/CardHeader';
import Button from '_shared/Button/Button';
import ListMenu from 'src/react/_components/ListMenu/ListMenu';
import FormModal from 'src/react/_components/FormModal/FormModal';

import planGetTitle from 'core/utils/plan/planGetTitle';
import request from 'core/utils/request';

import PlanSelect from 'src/react/Plan/Select/PlanSelect';
import PlanFilter from 'src/react/Plan/Filter/PlanFilter';
import useUpdate from 'core/react/_hooks/useUpdate';
import useRequest from 'core/react/_hooks/useRequest';
import contextMenu from 'src/utils/contextMenu';
import withNav from 'src/react/_hocs/Nav/withNav';

PlanOverview.sizes = [750];

export default withNav(PlanOverview);

function PlanOverview({ planId, nav }) {
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

  const plan = req.result.plan;

  const subtitle = {
    ownedBy: req.result.plan.owned_by
  };

  const title = planGetTitle(plan);

  const callbackDeletePlan = () => {
    request('plan.delete', {
      plan_id: planId
    });
  };

  const handleDeletePlan = () => {
    nav.openModal(FormModal, {
      title: 'Delete plan',
      subtitle: 'Are you sure you want to delete this plan?',
      onConfirm: callbackDeletePlan,
      confirmLabel: 'Delete'
    });
  };

  const openContextMenu = e => {
    contextMenu(ListMenu, e, {
      onClick: handleDeletePlan,
      buttons: ['Delete Plan']
    });
  };

  return (
    <CardContent
      noframe
      header={
        <CardHeader padding={30} title={title} subtitle={subtitle} separator>
          <Button icon="ThreeDots" onClick={openContextMenu} />
        </CardHeader>
      }
    >
      {plan.started_at ? (
        <PlanFilter plan={plan} />
      ) : (
        <PlanSelect plan={plan} />
      )}
    </CardContent>
  );
}
