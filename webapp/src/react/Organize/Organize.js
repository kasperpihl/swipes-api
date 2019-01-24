import React, { PureComponent } from 'react';
import ProjectList from 'src/react/Project/List/ProjectList';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import SWView from 'src/react/_Layout/view-controller/SWView';
import Button from 'src/react/_components/Button/Button';

export default class Organize extends PureComponent {
  static sizes = () => [600];
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
