import React, { PropTypes } from 'react';
import './styles/unread-bar.scss';

const UnreadBar = (props) => {
  const {
    title,
    onClick,
  } = props;

  return (
    <div className="unread-bar">
      <div className="unread-bar__title">{title}</div>
      <div onClick={onClick} className="unread-bar__button">Mark as read</div>
    </div>
  );
};

export default UnreadBar;

const { string, func } = PropTypes;

UnreadBar.propTypes = {
  title: string,
  onClick: func,
};
