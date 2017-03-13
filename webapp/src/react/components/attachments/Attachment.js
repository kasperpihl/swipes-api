import React, { PropTypes } from 'react';
import Icon from 'Icon';

import './styles/attachment.scss';

const Attachment = (props) => {
  const {
    icon,
    title,
    onFlag,
    onDelete,
    onClick,
    flagged,
    enableFlagging,
  } = props;

  let className = 'attachment';

  if (flagged) {
    className += ' attachment--flagged';
  }

  if (enableFlagging) {
    className += ' attachment--flagable';
  }

  return (
    <div className={className}>
      <div className="attachment__title" onClick={onClick}>
        <div className="attachment__icon">
          <Icon icon={icon} className="attachment__svg" />
        </div>
        <div className="attachment__words">
          {title}
        </div>
      </div>
      <div className="attachment__actions">
        <div className="attachment__button attachment__button--delete" onClick={onDelete}>
          <Icon icon="Trash" className="attachment__svg" />
        </div>
        <div className="attachment__button attachment__button--flag" onClick={onFlag}>
          <Icon icon="Flag" className="attachment__svg" />
        </div>
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
  enableFlagging: bool,
  onFlag: func,
  onDelete: func,
  onClick: func,
};
