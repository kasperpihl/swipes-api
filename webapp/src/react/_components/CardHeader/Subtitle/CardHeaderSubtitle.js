import React from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import orgGetBelonging from 'core/utils/org/orgGetBelonging';
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
        organizationId: ownedBy,
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
      <SW.OrganizationName>{orgGetBelonging(ownedBy)} / </SW.OrganizationName>
      {members && (
        <SW.FollowerLabel
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <SW.Icon icon={privacy === 'private' ? 'ThreeDots' : 'Earth'} />
          {/* TODO: Change icon once privacy is wired up */}
          {`${members.length} follower${members.length === 1 ? '' : 's'}`}
        </SW.FollowerLabel>
      )}
      <SW.Actions>{children}</SW.Actions>
    </SW.Wrapper>
  );
}
