import React from 'react';
import SW from './ProjectList.swiss';
import useNav from 'src/react/_hooks/useNav';
import useUpdate from 'core/react/_hooks/useUpdate';
import usePaginationRequest from 'core/react/_hooks/usePaginationRequest';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';

import PaginationScrollToMore from 'src/react/_components/pagination/PaginationScrollToMore';
import SectionHeader from 'src/react/_components/SectionHeader/SectionHeader';
import CardHeader from 'src/react/_components/Card/Header/CardHeader';
import CardContent from 'src/react/_components/Card/Content/CardContent';
import Button from 'src/react/_components/Button/Button';
import ModalCreate from 'src/react/Modal/Create/ModalCreate';
import ProjectListItem from './Item/ProjectListItem';

ProjectList.sizes = [750];

export default function ProjectList() {
  const nav = useNav();
  const req = usePaginationRequest(
    'project.list',
    {},
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

  const handleNewProject = () => {
    nav.openModal(ModalCreate, {
      type: 'project'
    });
  };

  if (!req.items) {
    return <RequestLoader req={req} />;
  }

  return (
    <CardContent
      noframe
      header={
        <CardHeader padding={30} title="Projects">
          <Button icon="Plus" onClick={handleNewProject} />
        </CardHeader>
      }
    >
      <SW.Wrapper>
        <SectionHeader>
          <SW.Name>Name</SW.Name>
          <SW.Team>Team</SW.Team>
        </SectionHeader>
        {req.items.map(project => (
          <ProjectListItem key={project.project_id} project={project} />
        ))}
        <PaginationScrollToMore req={req} errorLabel="Couldn't get projects." />
      </SW.Wrapper>
    </CardContent>
  );
}
