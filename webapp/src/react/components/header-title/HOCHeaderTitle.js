import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { list } from 'react-immutable-proptypes';
import * as a from 'actions';
import { setupDelegate } from 'swipes-core-js/classes/utils';

import './styles/header-title.scss';

export default class HOCHeaderTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this, 'onTitleClick', 'navbarLoadedInput');
  }
  componentDidMount() {
    const { input } = this.refs;
    this.navbarLoadedInput(input);
  }
  renderInputTitle(placeholder) {
    const {
      title,
      pop, // eslint-disable-line
      children, // eslint-disable-line
      delegate, // eslint-disable-line
      ...rest
    } = this.props;

    return (
      <input
        type="text"
        ref="input"
        {...rest}
        className="header-title__input"
        key="header-input"
      />
    );
  }
  renderTitle() {
    const { title, subtitle, subtitleElement } = this.props;

    return (
      <div className="header-title__title" key="header-title" onClick={this.onTitleClick}>
        {title}
        <div className="header-title__subtitle">{subtitle}</div>
      </div>
    );
  }
  renderContent() {
    const { title, placeholder } = this.props;

    if (placeholder) {
      return this.renderInputTitle(placeholder);
    }

    return this.renderTitle();
  }
  render() {
    const { children, subtitle, border } = this.props;
    let className = 'header-title';

    if (!subtitle) {
      className += ' header-title--no-subtitle';
    }

    if (border) {
      className += ' header-title--border';
    }

    return (
      <div className={className}>
        {this.renderContent()}
        <div className="header-title__actions">
          {children}
        </div>
      </div>
    );
  }
}

const { object, string, array, oneOfType, element } = PropTypes;

HOCHeaderTitle.propTypes = {
  title: string,
  placeholder: string,
  subtitle: oneOfType([string, element, array]),
  delegate: object,
  children: oneOfType([object, array]),
};
