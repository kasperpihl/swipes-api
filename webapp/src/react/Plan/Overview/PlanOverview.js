import React, { useEffect } from 'react';
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
import useNav from 'src/react/_hooks/useNav';
import contextMenu from 'src/utils/contextMenu';

PlanOverview.sizes = [750];

export default function PlanOverview({ planId }) {
  const nav = useNav();
  const req = useRequest('plan.get', {
    plan_id: planId
  });

  useUpdate('plan', plan => {
    if (plan.plan_id === planId) {
      req.merge('plan', plan);
    }
  });

  useUpdate('plan_project_task', planProjectTask => {
    req.merge('plan', plan => {
      const newPlan = { ...plan };
      newPlan.tasks = plan.tasks.filter(
        ({ project_id, task_id }) =>
          !(
            planProjectTask.task_id === task_id &&
            planProjectTask.project_id === project_id
          )
      );
      if (!planProjectTask.deleted) {
        newPlan.tasks.push(planProjectTask);
      }
      return newPlan;
    });
  });

  console.log('render plan', req.result && req.result.plan.deleted);
  useEffect(() => {
    if (req.result && req.result.plan.deleted) {
      nav.pop();
    }
  });
  if (req.result && req.result.plan.deleted) {
    return null;
  }
  if (req.error || req.loading) {
    return <RequestLoader req={req} />;
  }

  const plan = req.result.plan;

  const subtitle = {
    ownedBy: req.result.plan.owned_by
  };

  const title = planGetTitle(plan);

  const handleDeletePlan = () => {
    request('plan.delete', {
      plan_id: planId
    }).then(res => {
      if (res.ok) {
        nav.pop();
      }
    });
  };

  const handleContextSelect = () => {
    nav.openModal(FormModal, {
      title: 'Delete plan',
      subtitle: 'Are you sure you want to delete this plan?',
      onConfirm: handleDeletePlan,
      confirmLabel: 'Delete'
    });
  };

  const openContextMenu = e => {
    contextMenu(ListMenu, e, {
      onClick: handleContextSelect,
      buttons: ['Delete Plan']
    });
  };

  return (
    <CardContent
      noframe
      header={
        <CardHeader padding={18} title={title} subtitle={subtitle} separator>
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
