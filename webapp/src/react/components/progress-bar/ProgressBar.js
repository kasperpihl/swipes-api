import React, { PropTypes } from 'react';

import './styles/progress-bar';

const ProgressBar = (props) => {
  const {
    length,
    completed,
    onClick,
  } = props;
  const progressLength = 100 - ((completed * 100) / length);
  const styles = {
    WebkitClipPath: `inset(0 ${progressLength}% 0 0 round 5px)`,
  };

  return (
    <div className="progress-bar" onClick={onClick}>
      <div className="progress-bar__filling" style={styles} />
    </div>
  );
};

export default ProgressBar;

const { number, func } = PropTypes;

ProgressBar.propTypes = {
  length: number.isRequired,
  completed: number.isRequired,
  onClick: func,
};
