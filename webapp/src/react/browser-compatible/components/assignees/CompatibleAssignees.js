import React from 'react';
import SW from './CompatibleAssignees.swiss';

export default (props) => {
  const {
    assignee,
    float = '',
  } = props;
  const photoSrc = msgGen.users.getPhoto(assignee);
  const assigneeInitials = msgGen.users.getInitials(assignee);

  return (
    <SW.Wrapper>
      <SW.Assignee float={float}>
        {photoSrc ? (
          <SW.ProfilePic src={photoSrc} />
        ) : (
          <SW.Initials>{assigneeInitials}</SW.Initials>
        )}
      </SW.Assignee>
    </SW.Wrapper>
  );
};