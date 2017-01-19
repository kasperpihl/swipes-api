import React, { PropTypes } from 'react';
import './styles/milestone-item.scss';

const MilestoneItem = (props) => {
  const {
    title,
    onClick,
  } = props;

  return (
    <div className="milestone-item" onClick={onClick}>
      {title}
    </div>
  );
};

export default MilestoneItem;

const { string, func, number, shape } = PropTypes;

MilestoneItem.propTypes = {
  onClick: func,
  title: string.isRequired,
  daysLeft: string,
  goals: shape({
    total: number.isRequired,
    completed: number.isRequired,
  }),
  status: shape({
    src: string.isRequired,
    message: string.isRequired,
    timeAgo: string.isRequired,
  }),
};
