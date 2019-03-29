import React from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import teamGetBelonging from 'core/utils/team/teamGetBelonging';
import TooltipUsers from 'src/react/_components/TooltipUsers/TooltipUsers';

import SW from './CardHeaderSubtitle.swiss';

export default connect(
  null,
  {
    tooltip: mainActions.tooltip
  }
)(CardHeaderSubtitle);
function CardHeaderSubtitle({ subtitle, children, tooltip }) {
  if (typeof subtitle === 'string') {
    return (
      <SW.Wrapper>
        <SW.TeamName>{subtitle}</SW.TeamName>
        <SW.Actions>{children}</SW.Actions>
      </SW.Wrapper>
    );
  }

  const { ownedBy, members, privacy } = subtitle;
  const onMouseEnter = e => {
    if (!members || !members.length) return;
    tooltip({
      component: TooltipUsers,
      props: {
        teamId: ownedBy,
        userIds: members,
        size: 24
      },
      options: {
        boundingRect: e.target.getBoundingClientRect(),
        position: 'right'
      }
    });
  };

  const onMouseLeave = () => {
    if (!members || !members.length) return;
    tooltip(null);
  };

  return (
    <SW.Wrapper>
      <SW.TeamName>{teamGetBelonging(ownedBy)}</SW.TeamName>
      {members && privacy === 'private' && (
        <SW.MemberLabel
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={subtitle.onClick}
        >
          {`${members.length} member${members.length === 1 ? '' : 's'}`}
        </SW.MemberLabel>
      )}
      <SW.Actions>{children}</SW.Actions>
    </SW.Wrapper>
  );
}
