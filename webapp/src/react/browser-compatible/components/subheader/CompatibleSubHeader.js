import React from 'react';
import PropTypes from 'prop-types';
import { styleElement } from 'react-swiss';
import styles from './CompatibleSubHeader.swiss';

const CompatibleSubHeaderWrapper = styleElement('h4', styles, 'CompatibleSubHeaderWrapper');

const CompatibleSubHeader = (props) => {
  const {
    title,
  } = props;

  return (
    <CompatibleSubHeaderWrapper>
      {title}
    </CompatibleSubHeaderWrapper>
  );
};

export default CompatibleSubHeader;

const { string, func } = PropTypes;

CompatibleSubHeader.propTypes = {
  title: string,
  onClick: func,
};
