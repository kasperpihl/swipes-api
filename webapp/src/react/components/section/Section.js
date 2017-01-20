import React, { PropTypes } from 'react';

import './styles/section';

const Section = (props) => {
  const {
    title,
    children,
    first,
    style,
    maxWidth,
  } = props;

  let className = 'section';
  let styles = {};

  if (first) {
    className += ' section--first';
  }

  if (style) {
    styles = style;
  }

  if (maxWidth) {
    styles.maxWidth = maxWidth;
  }

  return (
    <div className={className} style={styles}>
      <div className="section__title">{title}</div>

      {children}
    </div>
  );
};

export default Section;

const { string, oneOfType, array, object, bool, number } = PropTypes;

Section.propTypes = {
  title: string,
  children: oneOfType([array, object]),
  first: bool,
  style: object,
  maxWidth: number,
};
