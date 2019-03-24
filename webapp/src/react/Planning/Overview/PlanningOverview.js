import React from 'react';
import RequestLoader from '_shared/RequestLoader/RequestLoader';
import PlanningModal from 'src/react/Planning/Modal/PlanningModal';
import useRequest from 'core/react/_hooks/useRequest';
import useUpdate from 'core/react/_hooks/useUpdate';
import useNav from 'src/react/_hooks/useNav';

import SW from './PlanningOverview.swiss';

export default function PlanningOverview({ ownedBy, yearWeek }) {
  const nav = useNav();
  const req = useRequest('planning.listTasks', {
    owned_by: ownedBy,
    year_week: yearWeek
  });

  useUpdate('planning_task', planningTask => {
    if (
      planningTask.owned_by === ownedBy &&
      planningTask.year_week === yearWeek
    ) {
      req.merge('tasks', tasks => {
        tasks = tasks.filter(
          ({ project_id, task_id }) =>
            !(
              planningTask.task_id === task_id &&
              planningTask.project_id === project_id
            )
        );
        if (!planningTask.deleted) {
          tasks.push(planningTask);
        }
        return tasks;
      });
    }
  });

  const handleAddTasks = () => {
    nav.openModal(PlanningModal, {
      yearWeek,
      ownedBy
    });
  };

  if (req.error || req.loading) {
    return <RequestLoader req={req} />;
  }

  if (!req.result.tasks.length) {
    return <div onClick={handleAddTasks}>No tasks :(</div>;
  }

  return (
    <SW.Wrapper>
      {req.result.tasks.map(task => {
        return <div key={task.task_id}>{task.task_id}</div>;
      })}
    </SW.Wrapper>
  );
}
