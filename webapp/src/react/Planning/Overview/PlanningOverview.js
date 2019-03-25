import React, { useState } from 'react';
import RequestLoader from '_shared/RequestLoader/RequestLoader';
import PlanningModal from 'src/react/Planning/Modal/PlanningModal';
import useRequest from 'core/react/_hooks/useRequest';
import useUpdate from 'core/react/_hooks/useUpdate';
import EmptyState from '_shared/EmptyState/EmptyState';
import useNav from 'src/react/_hooks/useNav';
import Spacing from '_shared/Spacing/Spacing';
import Button from '_shared/Button/Button';
import ActionBar from '_shared/ActionBar/ActionBar';
import StepSlider from '_shared/StepSlider/StepSlider';
import parseWeekLabel from '_shared/WeekPicker/parseWeekLabel';

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

  const [sliderValue, changeSliderValue] = useState(0);

  const handleAddTasks = () => {
    console.log('handle');
    nav.openModal(PlanningModal, {
      yearWeek,
      ownedBy,
      initialTasks: req.result.tasks
    });
  };

  const handleChange = e => {
    changeSliderValue(parseInt(e.target.value));
  };

  const weekLabel = parseWeekLabel(yearWeek);
  console.log(weekLabel);

  const actions = [
    <StepSlider
      sliderValue={sliderValue}
      onSliderChange={handleChange}
      min={0}
      max={5}
    />,
    <Button title="Add Tasks" icon="CircledPlus" onClick={handleAddTasks} />
  ];

  if (req.error || req.loading) {
    return <RequestLoader req={req} />;
  }

  if (!req.result.tasks.length) {
    return (
      <SW.Wrapper>
        <SW.EmptyStateWrapper>
          <EmptyState
            showIcon
            fill
            title={`Nothing planned for ${weekLabel}`}
            description="Add tasks from a project"
            icon="Typewriter"
          />
          <Spacing height={21} />
          <Button
            title="Add tasks"
            icon="CircledPlus"
            onClick={handleAddTasks}
          />
        </SW.EmptyStateWrapper>
        <ActionBar actions={actions} />
      </SW.Wrapper>
    );
  }

  return (
    <SW.Wrapper>
      {req.result.tasks.map(task => {
        return <div key={task.task_id}>{task.task_id}</div>;
      })}
      <ActionBar actions={actions} />
    </SW.Wrapper>
  );
}
