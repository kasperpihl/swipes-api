import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import SW from './ProjectList.swiss';
import withRequests from 'swipes-core-js/components/withRequests';
import ProjectListItem from './Item/ProjectListItem';
import AssigneeComponent from 'src/react/_components/assignee-component/AssigneeComponent';

const testUsers = ['alex', 'petar', 'test', 'kasper'];

@connect(state => ({
  me: state.me
}))
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
    const { projects, me } = this.props;
    console.log('proj', projects.toJS());

    return (
      <SW.Wrapper>
        {projects.map(project => (
          <ProjectListItem
            key={project.get('project_id')}
            project={project}
            me={me}
          />
        ))}
        <AssigneeComponent />
      </SW.Wrapper>
    );
  }
}
