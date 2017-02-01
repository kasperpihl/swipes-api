import React, { PropTypes } from 'react';
import Icon from 'Icon';
import './styles/notification-wrapper';

const NotificationWrapper = (props) => {
  const {
    message,
    svg,
    iconBgColor,
    onClick,
    timeago,
    unread,
  } = props;
  const style = {};
  let className = 'notification';

  if (iconBgColor) {
    style.fill = iconBgColor;
    style.stroke = iconBgColor;
  }

  if (unread) {
    className += ' notification--unread';
  }

  return (
    <div className={className} onClick={onClick}>
      <div className="notification__icon" >
        <Icon svg={svg} style={style} className="notification__svg" />
      </div>
      <div className="notification__message">
        {message}
      </div>
      <div className="notification__timestamp">
        {timeago}
      </div>
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
