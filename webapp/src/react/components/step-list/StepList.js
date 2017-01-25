import React, { PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';

import './styles/step-list.scss';

const StepList = (props) => {
  const { steps, completed } = props;

  if (!steps) {
    return undefined;
  }

  const renderSteps = steps.map((s, i) => {
    let className = 'step-list__item';

    if (i <= completed) {
      className += ' step-list__item--completed';
    } else if (i === completed + 1) {
      className += ' step-list__item--current';
    } else {
      className += ' step-list__item--future';
    }

    return (
      <div className={className} key={i}>{s.get('title')}</div>
    );
  }).toArray();

  return (
    <div className="step-list">
      {renderSteps}
    </div>
  );
};

export default StepList;

const { number } = PropTypes;

StepList.propTypes = {
  steps: map,
  completed: number,
};
