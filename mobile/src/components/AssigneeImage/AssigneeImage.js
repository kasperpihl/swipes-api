import React from 'react';
import SW from './AssigneeImage.swiss';

export default (props) => {
  const { userId } = props;
  const pic = msgGen.users.getPhoto(userId);
  const initials = msgGen.users.getInitials(userId);

  if (pic) {
    return (
      <SW.Image source={{ uri: pic }} />
    );
  }

  return (
    <SW.InitialWrapper><SW.Initial>{initials}</SW.Initial></SW.InitialWrapper>
  );
};
