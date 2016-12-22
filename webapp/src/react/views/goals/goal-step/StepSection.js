import React, { PropTypes } from 'react';

import './styles/step-section';

const StepSection = (props) => {
  const {
    title,
    children,
  } = props;

  return (
    <div className="step-section">
      <div className="step-section__title">{title}</div>
      {children}
    </div>
  );
};

export default StepSection;

const { string, oneOfType, array, object } = PropTypes;

StepSection.propTypes = {
  title: string,
  children: oneOfType([array, object]),
};
