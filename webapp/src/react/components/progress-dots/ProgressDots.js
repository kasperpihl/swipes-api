import React, { PropTypes } from 'react';
import classnames from 'classnames';
import './styles/progress-dots';

const ProgressDots = (props) => {
  const {
    length,
    completed,
    onClick,
  } = props;
  const itemsHtml = Array.from(Array(length).keys()).map((v, i) => {
    const className = classnames('progress-dots__dot', {
      current: (i === completed),
      completed: (i < completed),
    });
    return <div key={i} className={className} />;
  });
  return (
    <div className="progress-dots" onClick={onClick}>
      {itemsHtml}
    </div>
  );
};

export default ProgressDots;

const { number, func } = PropTypes;

ProgressDots.propTypes = {
  length: number.isRequired,
  completed: number.isRequired,
  onClick: func,
};
