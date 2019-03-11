import { useReducer } from 'react';
import request from 'core/utils/request';

export default function usePlanProjectSelect(plan) {
  const [selectedTasks, toggleSelectedTask] = useReducer((state, action) => {
    const newState = [].concat(state);
    const index = state.indexOf(action.payload);
    switch (action.type) {
      case 'add':
        newState.push(action.payload);
        break;
      case 'remove':
        newState.splice(index, 1);
        break;
    }

    return newState;
  }, plan.tasks.map(({ project_id, task_id }) => `${project_id}_-_${task_id}`));

  const handleToggleTask = (projectId, taskId) => {
    let endpoint = 'plan.addTask';
    let type = 'add';
    const params = {
      plan_id: plan.plan_id,
      project_id: projectId,
      task_id: taskId
    };

    const key = `${projectId}_-_${taskId}`;
    if (selectedTasks.indexOf(key) > -1) {
      endpoint = 'plan.removeTask';
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
