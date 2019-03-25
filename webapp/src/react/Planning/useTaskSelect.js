import { useReducer } from 'react';
import request from 'core/utils/request';
import useUpdate from 'core/react/_hooks/useUpdate';

export default function useTaskSelect(
  ownedBy,
  projectId,
  yearWeek,
  initialTasks
) {
  const [selectedTasks, toggleSelectedTask] = useReducer((state, action) => {
    const newState = [].concat(state);
    const index = state.indexOf(action.payload);
    if (index > -1) {
      newState.splice(index, 1);
    }
    switch (action.type) {
      case 'add':
        newState.push(action.payload);
        break;
      case 'remove':
        break;
    }
    return newState;
  }, initialTasks.map(({ project_id, task_id }) => `${project_id}_-_${task_id}`));

  useUpdate('planning_task', ({ project_id, task_id, year_week, deleted }) => {
    if (project_id === projectId && year_week === yearWeek) {
      toggleSelectedTask({
        type: deleted ? 'remove' : 'add',
        payload: `${project_id}_-_${task_id}`
      });
    }
  });

  const handleToggleTask = (projectId, taskId) => {
    let endpoint = 'planning.addTask';
    let type = 'add';
    const params = {
      owned_by: ownedBy,
      year_week: yearWeek,
      project_id: projectId,
      task_id: taskId
    };

    const key = `${projectId}_-_${taskId}`;
    if (selectedTasks.indexOf(key) > -1) {
      endpoint = 'planning.removeTask';
      type = 'remove';
    }
    toggleSelectedTask({
      type,
      payload: key
    });
    request(endpoint, params);
  };

  return [selectedTasks, handleToggleTask];
}
