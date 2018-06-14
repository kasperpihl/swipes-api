import React from 'react';
import PropTypes from 'prop-types';
import CompatibleAssignees from 'compatible/components/assignees/CompatibleAssignees';
import SW from './CompatibleHeader.swiss';

const CompatibleHeader = (props) => {
  const {
    assignee,
    title,
    subtitle,
    center
  } = props;

  return (
    <SW.Wrapper center={center}>
      <SW.TitleContainer>
        {assignee && <CompatibleAssignees assignee={assignee} float="right" />}
        <h1>{title}</h1>
        <h3>{subtitle}</h3>
      </SW.TitleContainer>
    </SW.Wrapper>
  );
};

export default CompatibleHeader;

const { string, object, func } = PropTypes;

CompatibleHeader.propTypes = {
  assignee: object,
  title: string,
  subtitle: string,
};
