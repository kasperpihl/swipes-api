import React from 'react';
import PropTypes from 'prop-types';
// import { bindAll } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { setupDelegate } from 'react-delegate';
import './styles/assignees.scss';

const CompatibleAssignees = (props) => {
  const {
    assignee,
  } = props;
  const photoSrc = msgGen.users.getPhoto(assignee);

  return (
    <div className="compatible-assignees">
      <div className="assignee">
        {photoSrc ? (
          <img src={photoSrc} className="assignee__profile-pic" />
        ) : (
          <p className="assignee__initials">{msgGen.users.getInitials(assignee)}</p>
        )}
      </div>
    </div>
  );
};

export default CompatibleAssignees;

const { string, func } = PropTypes;

CompatibleAssignees.propTypes = {
  assignee: string,
};
