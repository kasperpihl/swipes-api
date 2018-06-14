import React from 'react';
import SW from './AssigneeImage.swiss';

export default (props) => {
  const { user, blackAndWhite } = props;
  const pic = msgGen.users.getPhoto(user);
  const fullName = msgGen.users.getFullName(user);
  const initials = msgGen.users.getInitials(user);

  if(pic) return (
    <SW.Image src={pic} alt={fullName} blackAndWhite={blackAndWhite} />
  );
  return (
    <SW.Initials>{initials}</SW.Initials>
  );
};
