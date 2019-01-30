import React, { PureComponent } from 'react';
import ProjectList from 'src/react/Project/List/ProjectList';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import SWView from 'src/react/_Layout/view-controller/SWView';
import Button from 'src/react/_components/Button/Button';
import ModalCreate from 'src/react/Modal/Create/ModalCreate';
import navWrapper from 'src/react/_Layout/view-controller/NavWrapper';

@navWrapper
export default class Organize extends PureComponent {
  static sizes = () => [600];
  handleNewProject = () => {
    const { openModal } = this.props;
    openModal(ModalCreate, {
      type: 'project'
    });
  };
  render() {
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
              onClick={this.handleNewProject}
            />
            <Button.Rounded icon="ThreeDots" />
          </CardHeader>
        }
      >
        <ProjectList />
      </SWView>
    );
  }
}
