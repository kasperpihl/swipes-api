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
    disableFlagging,
  } = props;

  let className = 'attachment';

  if (flagged) {
    className += ' attachment--flagged';
  }

  if (disableFlagging) {
    className += ' attachment--disabled';
  }

  return (
    <div className={className}>
      <div className="attachment__icon" onClick={onClickIcon}>
        <Icon svg={icon} className="attachment__svg" />
      </div>
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
