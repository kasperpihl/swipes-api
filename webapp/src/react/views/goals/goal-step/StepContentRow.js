import React, { PropTypes } from 'react';
import Icon from 'Icon';
import './styles/step-content-row';

const StepContentRow = (props) => {
  const {
    icon,
    title,
    onClick,
  } = props;
  return (
    <div className="step-content-row">
      <Icon svg={icon} />
      <div className="step-content-row__title" onClick={onClick}>
        {title}
      </div>
    </div>
  );
};

export default StepContentRow;

const { string, func } = PropTypes;

StepContentRow.propTypes = {
  icon: string,
  title: string,
  onClick: func,
};
