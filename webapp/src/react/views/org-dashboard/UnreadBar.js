import React, { PropTypes } from 'react';
import './styles/unread-bar.scss';

const UnreadBar = (props) => {
  const {
    title,
    onClick,
  } = props;

  return (
    <div className="unread-bar">
      {title}
      <div onClick={onClick}>Mark as read</div>
    </div>
  );
};

export default UnreadBar;

const { string, func } = PropTypes;

UnreadBar.propTypes = {
  title: string,
  onClick: func,
};
