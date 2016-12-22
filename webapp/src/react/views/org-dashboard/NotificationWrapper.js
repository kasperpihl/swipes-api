import React, { PropTypes } from 'react';
import Icon from 'Icon';

const NotificationWrapper = (props) => {
  const {
    message,
    svg,
    iconBgColor,
    onClick,
    timeago,
  } = props;

  return (
    <div className="notification-wrapper" onClick={onClick}>
      <Icon svg={svg} />
      {message}
      {timeago}
    </div>
  );
};

export default NotificationWrapper;

const { string, func, oneOfType, array, object } = PropTypes;

NotificationWrapper.propTypes = {
  iconBgColor: string,
  children: oneOfType([array, object]),
  timeago: string,
  svg: string,
  onClick: func,
};
