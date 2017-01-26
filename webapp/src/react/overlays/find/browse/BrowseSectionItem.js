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
      <Icon svg={leftIcon} className="browse-section-item__icon browse-section-item__icon--left" />
      <div className="browse-section-item__title">{title}</div>
      <Icon svg={rightIcon} className="browse-section-item__icon browse-section-item__icon--right" />
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
