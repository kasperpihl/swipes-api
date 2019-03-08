import React from 'react';

import PlanFilterProject from './Project/PlanFilterProject';
import PlanSideRunning from 'src/react/Plan/Side/Running/PlanSideRunning';

import SW from './PlanFilter.swiss';

export default function PlanFilter({ plan }) {
  const projects = {};
  plan.tasks.forEach(({ project_id, title, task_id }) => {
    if (!projects[project_id]) {
      projects[project_id] = {
        title,
        taskIds: []
      };
    }
    projects[project_id].taskIds.push(task_id);
  });
  const sortedProjectIds = Object.keys(projects).sort((a, b) =>
    projects[a].title.localeCompare(projects[b].title)
  );

  return (
    <SW.Wrapper>
      <PlanSideRunning plan={plan} />
      <SW.Content>
        {sortedProjectIds.map(project_id => (
          <PlanFilterProject
            key={project_id}
            projectId={project_id}
            project={projects[project_id]}
          />
        ))}
      </SW.Content>
    </SW.Wrapper>
  );
}
