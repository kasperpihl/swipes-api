import React, { PropTypes } from 'react';
import './styles/unread-bar.scss';

const UnreadBar = (props) => {
  const {
    title,
    onClick,
    showButton,
  } = props;

  let className = 'unread-bar';

  if (showButton) {
    className += ' unread-bar--with-button';
  }

  return (
    <div className={className}>
      <div className="unread-bar__title">{title}</div>
      <div onClick={onClick} className="unread-bar__button">Mark as read</div>
    </div>
  );
};

export default UnreadBar;

const { string, func, bool } = PropTypes;

UnreadBar.propTypes = {
  title: string,
  onClick: func,
  showButton: bool,
};
