import React, { PureComponent } from 'react';
import SW from './ProjectList.swiss';
import withRequests from 'swipes-core-js/components/withRequests';

@withRequests(
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
  { renderLoader: () => <div>loading</div> }
)
export default class ProjectList extends PureComponent {
  render() {
    const { projects } = this.props;
    console.log('proj', projects);

    return <SW.Wrapper />;
  }
}
