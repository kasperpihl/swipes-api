import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import SW from './ProjectList.swiss';
import compose from 'src/utils/compose';
import useNav from 'src/react/_hooks/useNav';
import withRequests from 'swipes-core-js/components/withRequests';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import SWView from 'src/react/_Layout/view-controller/SWView';
import Button from 'src/react/_components/Button/Button';
import ModalCreate from 'src/react/Modal/Create/ModalCreate';
import Loader from 'src/react/_components/loaders/Loader';
import ProjectListItem from './Item/ProjectListItem';

ProjectList.sizes = [750];

export default compose(
  connect(state => ({
    me: state.me
  })),
  withRequests(
    {
      projects: {
        request: {
          url: 'project.list',
          resPath: 'projects'
        },
        cache: {
          path: ['projectList']
        }
      }
    },
    { renderLoader: () => <Loader center /> }
  )
)(ProjectList);

function ProjectList({ me, projects }) {
  const nav = useNav();
  const handleNewProject = () => {
    nav.openModal(ModalCreate, {
      type: 'project'
    });
  };
  return (
    <SWView
      noframe
      header={
        <CardHeader
          padding={30}
          title="Projects"
          subtitle="Store all your projects here"
        >
          <Button.Rounded
            title="New project"
            icon="Plus"
            onClick={handleNewProject}
          />
        </CardHeader>
      }
    >
      <SW.Wrapper>
        {projects.map(project => (
          <ProjectListItem
            key={project.get('project_id')}
            project={project}
            me={me}
          />
        ))}
      </SW.Wrapper>
    </SWView>
  );
}
