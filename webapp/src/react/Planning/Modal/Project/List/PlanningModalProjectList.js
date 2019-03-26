import React from 'react';
import SW from './PlanningModalProjectList.swiss';
import useUpdate from 'core/react/_hooks/useUpdate';
import usePaginationRequest from 'core/react/_hooks/usePaginationRequest';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';
import Button from '_shared/Button/Button';
import Spacing from '_shared/Spacing/Spacing';

import PaginationScrollToMore from 'src/react/_components/pagination/PaginationScrollToMore';
import EmptyState from '_shared/EmptyState/EmptyState';
import teamGetBelonging from 'core/utils/team/teamGetBelonging';
import useNav from 'src/react/_hooks/useNav';

import ProjectListItem from 'src/react/Project/List/Item/ProjectListItem';

export default function PlanningModalProjectList({
  setProjectId,
  ownedBy,
  projectId
}) {
  const nav = useNav();
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
        <RequestLoader req={req} loaderProps={{ mini: true, size: 36 }} />
      </SW.ScrollWrapper>
    );
  }
  if (!req.items.length) {
    return (
      <SW.EmptyWrapper>
        <EmptyState
          title={`No ${teamGetBelonging(ownedBy)} projects yet`}
          description="Add projects before planning"
          icon="Typewriter"
        />
        <Spacing height={18} />
        <Button
          title="Go to Projects"
          border
          onClick={() => {
            nav.set({
              screenId: 'ProjectList',
              crumbTitle: 'Projects',
              props: {
                openAdd: true
              }
            });
          }}
        />
      </SW.EmptyWrapper>
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
