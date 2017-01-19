import React, { PropTypes } from 'react';

import './styles/step-section';

const StepSection = (props) => {
  const {
    title,
    children,
    first,
  } = props;

  let className = ' step-section';

  if (first) {
    className += ' step-section--first';
  }

  return (
    <div className={className}>
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
