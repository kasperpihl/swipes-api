import React from 'react';
import SW from './PlanningModalProjectList.swiss';
import useUpdate from 'core/react/_hooks/useUpdate';
import usePaginationRequest from 'core/react/_hooks/usePaginationRequest';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';
import PaginationScrollToMore from 'src/react/_components/pagination/PaginationScrollToMore';

import ProjectListItem from 'src/react/Project/List/Item/ProjectListItem';

export default function PlanningModalProjectList({
  setProjectId,
  ownedBy,
  projectId
}) {
  const req = usePaginationRequest(
    'project.list',
    {
      owned_by: ownedBy
    },
    {
      cursorKey: 'skip',
      idAttribute: 'project_id',
      resultPath: 'projects'
    }
  );

  useUpdate('project', update => {
    if (update.created_at) {
      req.prependItem(update);
    }
  });

  if (!req.items) {
    return (
      <SW.ScrollWrapper>
        <RequestLoader req={req} />
      </SW.ScrollWrapper>
    );
  }

  return (
    <SW.ScrollWrapper hidden={!!projectId}>
      {req.items.map(project => (
        <ProjectListItem
          key={project.project_id}
          project={project}
          hideTeam
          onClick={() => {
            setProjectId([project.project_id, project.title]);
          }}
        />
      ))}
      <PaginationScrollToMore req={req} errorLabel="Couldn't get projects." />
    </SW.ScrollWrapper>
  );
}
