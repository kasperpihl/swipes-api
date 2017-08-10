import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'Icon';

import './styles/section';

class Section extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderActions() {
    const { actions } = this.props;

    if (!actions) {
      return undefined;
    }

    return actions;
  }
  renderIcon() {
    const { icon } = this.props;
    if(!icon) {
      return undefined;
    }
    // KRIS_TODO: Style this icon section for take action and feed :)
    return (
      <div className="section__icon-container">
        <Icon className="section__icon" icon={icon} />
      </div>
    );
  }
  render() {
    const {
      title,
      children,
      className: classNameFromButton,
    } = this.props;

    let className = 'section';

    if (classNameFromButton && typeof classNameFromButton === 'string') {
      className += ` ${classNameFromButton}`;
    }

    return (
      <div ref="section" className={className}>
        <div className="section__header">
          {this.renderIcon()}
          <div className="section__title">{title}</div>
          {this.renderActions()}
        </div>
        {children}
      </div>
    );
  }
}

export default Section;

const { string, oneOfType, array, object, element } = PropTypes;

Section.propTypes = {
  title: string,
  children: oneOfType([array, object]),
  className: string,
  actions: element,
};
