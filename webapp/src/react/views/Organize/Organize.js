import React, { PureComponent } from 'react';
import ProjectList from 'src/react/views/Project/List/ProjectList';
import CardHeader from 'src/react/components/CardHeader/CardHeader';
import SWView from 'src/react/app/view-controller/SWView';
import Button from 'src/react/components/Button/Button';

export default class Organize extends PureComponent {
  render() {
    return (
      <SWView
        header={
          <CardHeader title="Organize" subtitle="Store all your projects here">
            <Button.Rounded title="Add project" icon="Plus" />
            <Button.Rounded icon="ThreeDots" />
          </CardHeader>
        }
      >
        <ProjectList />
      </SWView>
    );
  }
}
