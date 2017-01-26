import React, { PropTypes } from 'react';

const BrowseSectionItem = (props) => {
  const {
    title,
    onClick,
  } = props;

  return (
    <div className="browse-section-item" onClick={onClick}>
      {title}
    </div>
  );
};

export default BrowseSectionItem;

const { string, func } = PropTypes;

BrowseSectionItem.propTypes = {
  title: string,
  leftIcon: string,
  rightIcon: string,
  onClick: func,
};
