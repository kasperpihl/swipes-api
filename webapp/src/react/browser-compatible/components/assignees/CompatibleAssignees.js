import React from 'react';
import PropTypes from 'prop-types';
import { styleElement } from 'react-swiss';
import styles from './CompatibleAssignees.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Assignee = styleElement('div', styles.Assignee);
const ProfilePic = styleElement('img', styles.ProfilePic);
const Initials = styleElement('p', styles.Initials);

const CompatibleAssignees = (props) => {
  const {
    assignee,
    float = '',
  } = props;
  const photoSrc = msgGen.users.getPhoto(assignee);
  const assigneeInitials = msgGen.users.getInitials(assignee);

  return (
    <Wrapper>
      <Assignee float={float}>
        {photoSrc ? (
          <ProfilePic src={photoSrc} />
        ) : (
          <Initials>{assigneeInitials}</Initials>
        )}
      </Assignee>
    </Wrapper>
  );
};

export default CompatibleAssignees;

const { string, object, func } = PropTypes;

CompatibleAssignees.propTypes = {
  assignee: object,
  float: string,
};
