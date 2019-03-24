import React from 'react';
import moment from 'moment';
import SW from './ProjectListItem.swiss';
import ProgressCircle from 'src/react/_components/ProgressCircle/ProgressCircle';
import useNav from 'src/react/_hooks/useNav';
import teamGetBelonging from 'core/utils/team/teamGetBelonging';

export default function ProjectListItem({ project, hideTeam, onClick }) {
  const nav = useNav();
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
    nav.push({
      screenId: 'ProjectOverview',
      crumbTitle: 'Project',
      uniqueId: project.project_id,
      props: {
        projectId: project.project_id
      }
    });
  };

  const isNew = !project.opened_at;
  let openedAt;
  if (project.opened_at) {
    const now = moment();
    const openedMoment = moment(project.opened_at);
    if (openedMoment.isSame(now, 'days')) {
      openedAt = openedMoment.format('LT');
    } else {
      now.subtract(1, 'days');
      if (openedMoment.isSame(now, 'days')) {
        openedAt = 'Yesterday';
      } else {
        openedAt = openedMoment.format('MMM D');
      }
    }
  }

  return (
    <SW.Wrapper onClick={handleClick}>
      <SW.LeftSideWrapper>
        <ProgressCircle progress={project.completion_percentage} />
        <SW.HoverLabel>{project.completion_percentage}%</SW.HoverLabel>
      </SW.LeftSideWrapper>
      <SW.TextWrapper>
        <SW.Title>{project.title}</SW.Title>
        {!hideTeam && (
          <SW.Subtitle>{teamGetBelonging(project.owned_by)}</SW.Subtitle>
        )}
        <SW.DateOpened>
          {isNew && <span>New</span>}
          {!isNew && <span>{openedAt}</span>}
        </SW.DateOpened>
      </SW.TextWrapper>
    </SW.Wrapper>
  );
}
