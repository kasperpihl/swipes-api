import React from 'react';
import PropTypes from 'prop-types';
import { styleElement } from 'react-swiss';
import CompatibleAssignees from 'compatible/components/assignees/CompatibleAssignees';
import styles from './CompatibleHeader.swiss';

const HeaderWrapper = styleElement('div', styles.HeaderWrapper);
const TitleContainer = styleElement('div', styles.TitleContainer);

const CompatibleHeader = (props) => {
  const {
    assignee,
    title,
    subtitle,
    center
  } = props;

  return (
    <HeaderWrapper className={center ? 'center' : ''}>
      <TitleContainer>
        {assignee && <CompatibleAssignees assignee={assignee} float="right" />}
        <h1>{title}</h1>
        <h3>{subtitle}</h3>
      </TitleContainer>
    </HeaderWrapper>
  );
};

export default CompatibleHeader;

const { string, object, func } = PropTypes;

CompatibleHeader.propTypes = {
  assignee: object,
  title: string,
  subtitle: string,
};
