import React, { PureComponent } from 'react';
import SW from './ProjectListItem.swiss';
import ProgressCircle from 'src/react/_components/ProgressCircle/ProgressCircle';
import navWrapper from 'src/react/_Layout/view-controller/NavWrapper';
import orgGetBelonging from 'swipes-core-js/utils/org/orgGetBelonging';

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
          <SW.Subtitle>{orgGetBelonging(project.get('owned_by'))}</SW.Subtitle>
        </SW.TextWrapper>
      </SW.Wrapper>
    );
  }
}
