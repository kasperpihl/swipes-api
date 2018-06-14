import React from 'react';
import AssigneeImage from './AssigneeImage';
import SW from './AssigneeTooltip.swiss';

export default (props) => {
  const {
    assignees,
    size,
  } = props;

  return (
    <SW.Wrapper>
      {assignees.map((user, i) => (
        <SW.Item key={i}>
          <SW.ImageWrapper>
            <AssigneeImage user={user} size={size} />
          </SW.ImageWrapper>
          <SW.Name>{msgGen.users.getFullName(user)}</SW.Name>
        </SW.Item>
      ))}
    </SW.Wrapper>
  );
};
