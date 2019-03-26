import React, { useState, useEffect } from 'react';
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
import Spacing from '_shared/Spacing/Spacing';

ProjectList.sizes = [750];

export default function ProjectList({ openAdd }) {
  const nav = useNav();
  const [ownedBy, setOwnedBy] = useState();
  const params = {};
  if (ownedBy) {
    params.owned_by = ownedBy;
  }

  const req = usePaginationRequest('project.list', params, {
    cursorKey: 'skip',
    idAttribute: 'project_id',
    resultPath: 'projects'
  });

  useUpdate('project', update => {
    if (update.created_at) {
      req.prependItem(update);
    }
  });

  const handleFilter = ownedBy => {
    setOwnedBy(ownedBy);
    req.retry(true);
  };

  const handleNewProject = () => {
    nav.openModal(ModalCreate, {
      type: 'project',
      onSuccess: res => {
        nav.push({
          screenId: 'ProjectOverview',
          crumbTitle: 'Project',
          uniqueId: res.project_id,
          props: {
            projectId: res.project_id
          }
        });
      }
    });
  };
  useEffect(() => {
    if (openAdd) {
      handleNewProject();
    }
  }, []);

  if (!req.items) {
    return <RequestLoader req={req} />;
  }

  if (!req.items.length) {
    return (
      <CardContent
        noframe
        header={
          <CardHeader padding={18} title="Projects">
            <Button icon="CircledPlus" onClick={handleNewProject} />
          </CardHeader>
        }
      >
        <SW.Wrapper>
          <SW.EmptyState
            showIcon
            title="IT’S STILL AND QUIET"
            description={`Whenever someone creates a project \n it will show up here.`}
          />
        </SW.Wrapper>
      </CardContent>
    );
  }

  return (
    <CardContent
      noframe
      header={
        <>
          <CardHeader padding={18} title="Projects">
            <Button icon="CircledPlus" onClick={handleNewProject} />
          </CardHeader>{' '}
          <Spacing height={24} />
          <SectionHeader discussion>
            <SW.Name>Name</SW.Name>
            <SW.Team>Team</SW.Team>
            <SW.LastOpened>Last Opened</SW.LastOpened>
          </SectionHeader>
        </>
      }
    >
      <SW.Wrapper>
        {req.items.map(project => (
          <ProjectListItem
            key={project.project_id}
            project={project}
            onFilter={handleFilter}
            isFiltered={!!ownedBy}
          />
        ))}
        <PaginationScrollToMore req={req} errorLabel="Couldn't get projects." />
      </SW.Wrapper>
    </CardContent>
  );
}
