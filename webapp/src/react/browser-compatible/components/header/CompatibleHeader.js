import React from 'react';
import PropTypes from 'prop-types';
// import { bindAll } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { setupDelegate } from 'react-delegate';
import CompatibleAssignees from 'compatible/components/assignees/CompatibleAssignees';
import './styles/header.scss';

const CompatibleHeader = (props) => {
  const {
    assignee,
    title,
    subtitle,
  } = props;

  return (
    <div className="compatible-header">
      <div className="compatible-header__title-container">
        {assignee && <CompatibleAssignees assignee={assignee} />}
        <h1 className="compatible-header__title">{title}</h1>
      </div>
      <h3 className="compatible-header__subtitle">{subtitle}</h3>
    </div>
  );
};

export default CompatibleHeader;

const { string, func } = PropTypes;

CompatibleHeader.propTypes = {
  assignee: string,
  title: string,
  subtitle: string,
};
