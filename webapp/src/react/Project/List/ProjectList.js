import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
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

export default connect(state => ({
  selectedTeamId: state.main.get('selectedTeamId')
}))(ProjectList);

function ProjectList({ openAdd, selectedTeamId }) {
  const nav = useNav();
  const selectedRef = useRef(selectedTeamId);

  const req = usePaginationRequest(
    'project.list',
    {
      owned_by: selectedTeamId
    },
    {
      cursorKey: 'skip',
      idAttribute: 'project_id',
      resultPath: 'projects'
    }
  );

  useEffect(() => {
    if (selectedTeamId !== selectedRef.current) {
      req.retry(true);
    }
    selectedRef.current = selectedTeamId;
  }, [selectedTeamId]);

  useUpdate('project', update => {
    if (update.created_at) {
      req.prependItem(update);
    }
  });

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
    return (
      <CardContent
        noframe
        header={
          <CardHeader padding={18} title="Projects" teamPicker>
            <Button icon="CircledPlus" onClick={handleNewProject} />
          </CardHeader>
        }
      >
        <RequestLoader req={req} />
      </CardContent>
    );
  }

  if (!req.items.length) {
    return (
      <CardContent
        noframe
        header={
          <CardHeader padding={18} title="Projects" teamPicker>
            <Button icon="CircledPlus" onClick={handleNewProject} />
          </CardHeader>
        }
      >
        <SW.Wrapper empty>
          <SW.EmptyState
            icon="Typewriter"
            title="No Projects"
            description={`Create a new project and write down your tasks.`}
          />
          <Button
            title="Add a project"
            icon="CircledPlus"
            onClick={handleNewProject}
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
          <CardHeader padding={18} title="Projects" teamPicker>
            <Button icon="CircledPlus" onClick={handleNewProject} />
          </CardHeader>
          <Spacing height={24} />
          <SectionHeader discussion>
            <SW.Name>Name</SW.Name>
            <SW.LastOpened>Last Opened</SW.LastOpened>
          </SectionHeader>
        </>
      }
    >
      <SW.Wrapper>
        {req.items.map(project => (
          <ProjectListItem key={project.project_id} project={project} />
        ))}
        <PaginationScrollToMore req={req} errorLabel="Couldn't get projects." />
      </SW.Wrapper>
    </CardContent>
  );
}
