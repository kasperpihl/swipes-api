import React from 'react';
import PropTypes from 'prop-types';
import { styleElement } from 'swiss-react';
import styles from './CompatibleSubHeader.swiss';

const Wrapper = styleElement('h4', styles.Wrapper);

const CompatibleSubHeader = (props) => {
  const {
    title,
  } = props;

  return (
    <Wrapper>
      {title}
    </Wrapper>
  );
};

export default CompatibleSubHeader;

const { string, func } = PropTypes;

CompatibleSubHeader.propTypes = {
  title: string,
  onClick: func,
};
