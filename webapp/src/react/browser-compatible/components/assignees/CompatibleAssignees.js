import React from 'react';
import PropTypes from 'prop-types';
import { styleElement } from 'react-swiss';
import styles from './CompatibleAssignees.swiss';

const CompatibleAssigneesWrapper = styleElement('div', styles, 'CompatibleAssignees');
const Assignee = styleElement('div', styles, 'Assignee');
const ProfilePic = styleElement('img', styles, 'ProfilePic');
const Initials = styleElement('p', styles, 'Initials');

const CompatibleAssignees = (props) => {
  const {
    assignee,
    float = '',
  } = props;
  const photoSrc = msgGen.users.getPhoto(assignee);
  const assigneeInitials = msgGen.users.getInitials(assignee);

  return (
    <CompatibleAssigneesWrapper>
      <Assignee float={float}>
        {photoSrc ? (
          <ProfilePic src={photoSrc} />
        ) : (
          <Initials>{assigneeInitials}</Initials>
        )}
      </Assignee>
    </CompatibleAssigneesWrapper>
  );
};

export default CompatibleAssignees;

const { string, func } = PropTypes;

CompatibleAssignees.propTypes = {
  assignee: string,
  float: string,
};
