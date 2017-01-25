import React, { PropTypes } from 'react';
import Icon from 'Icon';

import './styles/attachment.scss';

const Attachment = (props) => {
  const {
    icon,
    title,
    onClickIcon,
    onClickText,
    flagged,
  } = props;

  return (
    <div className="attachment">
      <Icon svg={icon} className="attachment__icon" onClick={onClickIcon} />
      <div className="attachment__title" onClick={onClickText}>
        {title}
      </div>
    </div>
  );
};

export default Attachment;

const { string, func, bool } = PropTypes;

Attachment.propTypes = {
  flagged: bool,
  icon: string,
  title: string,
  onClickIcon: func,
  onClickText: func,
};
