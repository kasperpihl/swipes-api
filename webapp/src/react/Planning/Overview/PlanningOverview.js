import React from 'react';
import RequestLoader from '_shared/RequestLoader/RequestLoader';
import PlanningModal from 'src/react/Planning/Modal/PlanningModal';
import useRequest from 'core/react/_hooks/useRequest';
import useUpdate from 'core/react/_hooks/useUpdate';
import EmptyState from '_shared/EmptyState/EmptyState';
import useNav from 'src/react/_hooks/useNav';
import Spacing from '_shared/Spacing/Spacing';
import Button from '_shared/Button/Button';

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
    console.log('handle');
    nav.openModal(PlanningModal, {
      yearWeek,
      ownedBy,
      initialTasks: req.result.tasks
    });
  };

  if (req.error || req.loading) {
    return <RequestLoader req={req} />;
  }

  if (!req.result.tasks.length) {
    return (
      <SW.Wrapper>
        <EmptyState
          showIcon
          fill
          title="Nothing planned for this week"
          description="Add tasks from a project"
          icon="Typewriter"
        />
        <Spacing height={21} />
        <Button title="Add tasks" icon="CircledPlus" onClick={handleAddTasks} />
      </SW.Wrapper>
    );
  }

  return (
    <SW.Wrapper>
      {req.result.tasks.map(task => {
        return <div key={task.task_id}>{task.task_id}</div>;
      })}
    </SW.Wrapper>
  );
}
