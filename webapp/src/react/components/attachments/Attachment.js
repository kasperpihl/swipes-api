import React, { PropTypes } from 'react';
import Icon from 'Icon';

import './styles/attachment.scss';

const Attachment = (props) => {
  const {
    icon,
    title,
    onClick,
  } = props;

  return (
    <div className="attachment">
      <Icon svg={icon} className="attachment__icon" />
      <div className="attachment__title" onClick={onClick}>
        {title}
      </div>
    </div>
  );
};

export default Attachment;

const { string, func } = PropTypes;

Attachment.propTypes = {
  icon: string,
  title: string,
  onClick: func,
};
