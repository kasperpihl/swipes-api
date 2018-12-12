import React, { PureComponent } from 'react';
import ProjectList from 'src/react/views/Project/List/ProjectList';
import CardHeader from 'src/react/components/CardHeader/CardHeader';
import SWView from 'src/react/app/view-controller/SWView';

export default class Organize extends PureComponent {
  render() {
    return (
      <SWView header={<CardHeader title="Organize" />}>
        <ProjectList />
      </SWView>
    );
  }
}
