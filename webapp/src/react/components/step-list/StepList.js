import React, { PropTypes } from 'react';
import { list } from 'react-immutable-proptypes';
import HOCAssigning from 'components/assigning/HOCAssigning';
import Icon from 'Icon';

import './styles/step-list.scss';

const StepList = (props) => {
  const { steps, completed } = props;

  if (!steps) {
    return undefined;
  }

  const renderSteps = steps.map((s, i) => {
    let className = 'step-list-item';

    if (i < completed) {
      className += ' step-list-item--completed';
    } else if (i === completed) {
      className += ' step-list-item--current';
    } else {
      className += ' step-list-item--future';
    }

    return (
      <div className={className} key={i}>
        <div className="step-list-item__tooltip">Reassign current step</div>
        <div className="step-list-item__indicator">
          <div className="step-list-item__icon">
            <Icon svg="Checkmark" className="step-list-item__svg" />
          </div>
        </div>
        <div className="step-list-item__title">
          {s.get('title')}
        </div>
        <div className="step-list-item__assignees">
          <HOCAssigning assignees={s.get('assignees')} rounded size={24} />
        </div>
      </div>
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
  steps: list,
  completed: number,
};
