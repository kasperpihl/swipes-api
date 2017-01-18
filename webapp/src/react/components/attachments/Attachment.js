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
    <div className="step-content-row">
      <Icon svg={icon} className="step-content-row__icon" />
      <div className="step-content-row__title" onClick={onClick}>
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
