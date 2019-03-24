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
function CardHeaderSubtitle({ ownedBy, members, privacy, children, tooltip }) {
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
        <SW.FollowerLabel
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {`${members.length} follower${members.length === 1 ? '' : 's'}`}
        </SW.FollowerLabel>
      )}
      <SW.Actions>{children}</SW.Actions>
    </SW.Wrapper>
  );
}
