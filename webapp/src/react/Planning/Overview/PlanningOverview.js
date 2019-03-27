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
import Stepper from '_shared/Stepper/Stepper';
import parseWeekLabel from '_shared/WeekPicker/parseWeekLabel';
import PlanningList from 'src/react/Planning/List/PlanningList';
import usePlanningState from 'src/react/Planning/usePlanningState';
import useMyId from 'core/react/_hooks/useMyId';

import SW from './PlanningOverview.swiss';
import InputToggle from '_shared/Input/Toggle/InputToggle';
import UserImage from '_shared/UserImage/UserImage';

export default function PlanningOverview({ ownedBy, yearWeek }) {
  const myId = useMyId();
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
      ownedBy,
      initialTasks: req.result.tasks
    });
  };

  const [sliderValue, changeSliderValue] = useState(1);
  const [
    { editingId, maxDepth, stateManagers },
    updatePlanningState
  ] = usePlanningState();

  let actions = [];
  if (!editingId) {
    // Not editing!
    actions.push(
      <SW.ToggleWrapper>
        <InputToggle component={<UserImage userId={myId} size={24} />} />
      </SW.ToggleWrapper>
    );
    if (maxDepth) {
      const handleChange = number => {
        stateManagers.forEach(stateManager => {
          stateManager.expandHandler.setDepth(number - 1);
        });
        changeSliderValue(number);
      };
      actions.push(
        <Stepper
          minValue={1}
          value={sliderValue}
          onChange={handleChange}
          maxValue={maxDepth + 1}
        />
      );
    }
    actions.push(
      <Button title="Add Tasks" icon="CircledPlus" onClick={handleAddTasks} />
    );
  } else {
    // Editing!
    actions = [
      <Button
        title="Done editing"
        green
        icon="Checkmark"
        onClick={() => {
          updatePlanningState({ editingId: null });
        }}
      />
    ];
  }

  if (req.error || req.loading) {
    return <RequestLoader req={req} />;
  }

  if (!req.result.tasks.length) {
    const weekLabel = parseWeekLabel(yearWeek);
    return (
      <SW.Wrapper>
        <SW.EmptyStateWrapper>
          <EmptyState
            title={`Nothing planned for ${weekLabel}`}
            description="Add tasks from your projects"
            icon="Typewriter"
          />
          <Spacing height={18} />
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
      <SW.ScrollableWrapper>
        <PlanningList
          tasks={req.result.tasks}
          ownedBy={ownedBy}
          yearWeek={yearWeek}
        />
      </SW.ScrollableWrapper>

      <ActionBar actions={actions} green={!!editingId} />
    </SW.Wrapper>
  );
}
