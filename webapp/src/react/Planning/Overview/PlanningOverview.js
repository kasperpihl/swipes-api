import React, { useState, useRef, useEffect, useCallback } from 'react';
import RequestLoader from '_shared/RequestLoader/RequestLoader';
import PlanningModal from 'src/react/Planning/Modal/PlanningModal';
import useRequest from 'core/react/_hooks/useRequest';
import useUpdate from 'core/react/_hooks/useUpdate';
import parseWeekLabel from 'core/utils/time/parseWeekLabel';
import EmptyState from '_shared/EmptyState/EmptyState';
import useNav from 'src/react/_hooks/useNav';
import Spacing from '_shared/Spacing/Spacing';
import Button from '_shared/Button/Button';
import ActionBar from '_shared/ActionBar/ActionBar';
import Stepper from '_shared/Stepper/Stepper';
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
  const [showOnlyMe, setShowOnlyMe] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [borderVisible, setBorderVisible] = useState(false);

  const [
    { editingId, maxDepth, stateManagers },
    updatePlanningState
  ] = usePlanningState();

  const doneEditing = useCallback(() => {
    updatePlanningState({ editingId: null });
    stateManagers.forEach(stateManager => {
      stateManager.editHandler.doneEditing();
    });
  }, [updatePlanningState, stateManagers]);

  useEffect(() => {
    if (editingId) {
      const onKeyDown = e => {
        if (e.keyCode === 27) {
          e.target.blur();
          doneEditing();
        }
      };
      window.addEventListener('keydown', onKeyDown);
      return () => {
        window.removeEventListener('keydown', onKeyDown);
      };
    }
  }, [editingId, doneEditing]);

  const handleScroll = e => {
    if (e.target && e.target.scrollTop > 56) {
      setBorderVisible(true);
    } else {
      setBorderVisible(false);
    }
  };

  let actions = [];
  if (!editingId) {
    // Not editing!
    if (typeof stateManagers !== 'undefined') {
      const handleHideCompleted = () => {
        stateManagers.forEach(stateManager => {
          stateManager.filterHandler.setFilteredCompleted(!hideCompleted);
        });
        setHideCompleted(!hideCompleted);
      };

      const handleOnlyMe = () => {
        stateManagers.forEach(stateManager => {
          stateManager.filterHandler.setFilteredAssignee(
            showOnlyMe ? null : myId
          );
        });
        setShowOnlyMe(!showOnlyMe);
      };

      actions.push(
        <>
          <SW.ToggleWrapper key="hidecompleted">
            <Button icon="CircledCheckmark" onClick={handleHideCompleted} />
            <InputToggle value={hideCompleted} onChange={handleHideCompleted} />
          </SW.ToggleWrapper>
          <SW.ToggleWrapper key="showMe">
            <Button onClick={handleOnlyMe}>
              <UserImage userId={myId} size={24} />
            </Button>
            <InputToggle value={showOnlyMe} onChange={handleOnlyMe} />
          </SW.ToggleWrapper>
        </>
      );

      const handleChange = number => {
        stateManagers.forEach(stateManager => {
          stateManager.expandHandler.setDepth(number - 1);
        });
        changeSliderValue(number);
      };
      actions.push(
        <Stepper
          key="stepper"
          value={sliderValue}
          onChange={handleChange}
          maxValue={maxDepth + 1}
        />
      );
    }
    actions.push(
      <Button
        key="add"
        title="Add Tasks"
        icon="CircledPlus"
        onClick={handleAddTasks}
      />
    );
  } else {
    // Editing!
    actions = [
      <Button
        key="done"
        title="Done editing"
        green
        icon="Checkmark"
        onClick={doneEditing}
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
      <SW.ScrollableWrapper
        onScroll={handleScroll}
        borderVisible={borderVisible}
      >
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
