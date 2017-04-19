import React from 'react';
import PropTypes from 'prop-types';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
// import './styles/goal-row.scss';

const GoalRow = (props) => {
  const {
    title,
    onClick,
  } = props;
  console.log(props.option);
  return (
    <div className="goal-row" onClick={onClick}>
      {props.option.label}
    </div>
  );
};

export default GoalRow;

const { string, func } = PropTypes;

GoalRow.propTypes = {
  title: string,
  onClick: func,
};
