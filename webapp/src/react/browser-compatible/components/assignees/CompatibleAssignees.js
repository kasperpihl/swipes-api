import React from 'react';
import PropTypes from 'prop-types';
// import { bindAll } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { setupDelegate } from 'react-delegate';
import './styles/assignees.scss';

const CompatibleAssignees = (props) => {
  const {
    assignee,
    float
  } = props;
  const photoSrc = msgGen.users.getPhoto(assignee);
  let className = 'compatible-assignees';

  if (float && typeof float === 'string') {
    className += ` compatible-assignees--${float}`
  }

  return (
    <div className={className}>
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
