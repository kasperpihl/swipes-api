import React, { PropTypes } from 'react';
import './styles/milestone-item.scss';

const MilestoneItem = (props) => {
  const {
    title,
    daysLeft,
    goals,
    status,
    onClick,
  } = props;

  const styles = {};

  const progressLength = 100 - ((goals.completed * 100) / goals.total);
  styles.WebkitClipPath = `inset(0 ${Math.min(97, progressLength)}% 0 0 round 5px)`;

  return (
    <div className="milestone-item" onClick={onClick}>
      <div className="header">
        <div className="header__title">{title}</div>
        <div className="header__subtitle">
          <div className="header__days-left">{daysLeft}</div>
          <div className="header__completed">{goals.completed}/{goals.total}</div>
        </div>
      </div>
      <div className="progress-bar">
        <div className="progress-bar__completed" style={styles} />
      </div>
      <div className="status">
        <div className="status__image">
          <img src={status.src} alt="" />
        </div>
        <div className="status__message">{status.message}</div>
        <div className="status__time-ago">{status.timeAgo}</div>
      </div>
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
