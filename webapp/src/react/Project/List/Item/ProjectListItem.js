import React from 'react';
import SW from './ProjectListItem.swiss';
import ProgressCircle from 'src/react/_components/ProgressCircle/ProgressCircle';
import useNav from 'src/react/_hooks/useNav';
import orgGetBelonging from 'core/utils/org/orgGetBelonging';

export default function ProjectListItem({ project }) {
  const nav = useNav();
  const handleClick = () => {
    nav.push({
      screenId: 'ProjectOverview',
      crumbTitle: 'Project',
      uniqueId: project.project_id,
      props: {
        projectId: project.project_id
      }
    });
  };
  return (
    <SW.Wrapper onClick={handleClick}>
      <SW.LeftSideWrapper>
        <ProgressCircle progress={project.completion_percentage} />
        <SW.HoverLabel>{project.completion_percentage}%</SW.HoverLabel>
      </SW.LeftSideWrapper>
      <SW.TextWrapper>
        <SW.Title>{project.name}</SW.Title>
        <SW.Subtitle>{orgGetBelonging(project.owned_by)}</SW.Subtitle>
      </SW.TextWrapper>
    </SW.Wrapper>
  );
}
