import React, { PropTypes } from 'react';
import Icon from 'Icon';

const BrowseSectionItem = (props) => {
  const {
    title,
    onClick,
    leftIcon,
    rightIcon,
  } = props;

  return (
    <div className="browse-section-item" onClick={onClick}>
      <div className="browse-section-item__icon browse-section-item__icon--left">
        <Icon svg={leftIcon} className="browse-section-item__svg" />
      </div>
      <div className="browse-section-item__title">{title}</div>
      <div className="browse-section-item__icon browse-section-item__icon--right">
        <Icon svg={rightIcon} className="browse-section-item__svg" />
      </div>
    </div>
  );
};

export default BrowseSectionItem;

const { string, func, bool } = PropTypes;

BrowseSectionItem.propTypes = {
  title: string,
  selected: bool,
  leftIcon: string,
  rightIcon: string,
  onClick: func,
};
