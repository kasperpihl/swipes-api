import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { list } from 'react-immutable-proptypes';
import * as a from 'actions';
import { setupDelegate } from 'classes/utils';

import './styles/header-title.scss';

export default class HOCHeaderTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.callDelegate = setupDelegate(props.delegate);
    this.onClick = this.callDelegate.bind(null, 'onTitleClick');
  }
  componentDidMount() {
    const { input } = this.refs;
    this.callDelegate('navbarLoadedInput', input);
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
    const { title, subtitle } = this.props;

    return (
      <div className="header-title__title" key="header-title" onClick={this.onClick}>
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
    const { children } = this.props;

    return (
      <div className="header-title">
        {this.renderContent()}
        <div className="header-title__actions">
          {children}
        </div>
      </div>
    );
  }
}

const { object, string, array, oneOfType } = PropTypes;

HOCHeaderTitle.propTypes = {
  title: string,
  placeholder: string,
  subtitle: string,
  delegate: object,
  children: oneOfType([object, array]),
};
