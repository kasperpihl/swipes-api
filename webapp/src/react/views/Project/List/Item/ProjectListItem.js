import React, { PureComponent } from 'react';
import SW from './ProjectListItem.swiss';
import ProgressCircle from 'src/react/components/progress-circle/ProgressCircle';
import navWrapper from 'src/react/app/view-controller/NavWrapper';

@navWrapper
export default class ProjectListItem extends PureComponent {
  handleClick = () => {
    const { project, navPush } = this.props;
    navPush({
      id: 'ProjectOverview',
      title: 'Project',
      props: {
        projectId: project.get('project_id')
      }
    });
  };
  getSubtitleLabel() {
    const { project, me } = this.props;
    if (project.get('owned_by') === me.get('id')) {
      return 'Personal';
    }
    return 'Unknown';
  }
  render() {
    const { project } = this.props;
    return (
      <SW.Wrapper className="js-list-item-wrapper" onClick={this.handleClick}>
        <SW.LeftSideWrapper>
          <ProgressCircle progress={project.get('completion_percentage')} />
          <SW.HoverLabel>{project.get('completion_percentage')}%</SW.HoverLabel>
        </SW.LeftSideWrapper>
        <SW.TextWrapper>
          <SW.Title>{project.get('name')}</SW.Title>
          <SW.Subtitle>{this.getSubtitleLabel()}</SW.Subtitle>
        </SW.TextWrapper>
      </SW.Wrapper>
    );
  }
}
