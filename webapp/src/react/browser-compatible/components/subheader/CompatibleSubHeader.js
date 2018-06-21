import React from 'react';
import PropTypes from 'prop-types';
import SW from './CompatibleSubHeader.swiss';


const CompatibleSubHeader = (props) => {
  const {
    title,
  } = props;

  return (
    <SW.Wrapper>
      {title}
    </SW.Wrapper>
  );
};

export default CompatibleSubHeader;

const { string, func } = PropTypes;

CompatibleSubHeader.propTypes = {
  title: string,
  onClick: func,
};
