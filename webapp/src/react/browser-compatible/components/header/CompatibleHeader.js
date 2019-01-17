import React from 'react';
import PropTypes from 'prop-types';
import SW from './CompatibleHeader.swiss';

const CompatibleHeader = props => {
  const { title, subtitle, center } = props;

  return (
    <SW.Wrapper center={center}>
      <SW.TitleContainer>
        <h1>{title}</h1>
        <h3>{subtitle}</h3>
      </SW.TitleContainer>
    </SW.Wrapper>
  );
};

export default CompatibleHeader;

const { string } = PropTypes;

CompatibleHeader.propTypes = {
  title: string,
  subtitle: string
};
