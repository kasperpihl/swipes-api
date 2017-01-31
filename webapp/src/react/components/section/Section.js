import React, { Component, PropTypes } from 'react';

import './styles/section';

class Section extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      title,
      children,
      first,
      style,
      maxWidth,
      className: classNameFromButton,
    } = this.props;

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

    if (classNameFromButton && typeof classNameFromButton === 'string') {
      className += ` ${classNameFromButton}`;
    }

    return (
      <div ref="section" className={className} style={styles}>
        <div className="section__title">{title}</div>

        {children}
      </div>
    );
  }
}

export default Section;

const { string, oneOfType, array, object, bool, number } = PropTypes;

Section.propTypes = {
  title: string,
  children: oneOfType([array, object]),
  first: bool,
  style: object,
  maxWidth: number,
  className: string,
};
