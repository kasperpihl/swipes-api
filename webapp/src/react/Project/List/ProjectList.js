import React from 'react';
import { connect } from 'react-redux';
import SW from './ProjectList.swiss';
import compose from 'src/utils/compose';
import useNav from 'src/react/_hooks/useNav';
import CardHeader from 'src/react/_components/Card/Header/CardHeader';
import CardContent from 'src/react/_components/Card/Content/CardContent';
import Button from 'src/react/_components/Button/Button';
import ModalCreate from 'src/react/Modal/Create/ModalCreate';
import ProjectListItem from './Item/ProjectListItem';

ProjectList.sizes = [750];

export default compose(
  connect(state => ({
    me: state.me
  }))
  // withRequests(
  //   {
  //     projects: {
  //       request: {
  //         url: 'project.list',
  //         resPath: 'projects'
  //       },
  //       cache: {
  //         path: ['projectList']
  //       }
  //     }
  //   },
  //   { renderLoader: () => <Loader center /> }
  // )
)(ProjectList);

function ProjectList({ me, projects }) {
  const nav = useNav();
  const handleNewProject = () => {
    nav.openModal(ModalCreate, {
      type: 'project'
    });
  };
  return (
    <CardContent
      noframe
      header={
        <CardHeader title="Projects">
          <Button icon="Plus" onClick={handleNewProject} />
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
    </CardContent>
  );
}
