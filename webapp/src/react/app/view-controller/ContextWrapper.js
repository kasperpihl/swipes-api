import React, { Component } from 'react';
import PropTypes from 'prop-types';
const { string, element, func, number } = PropTypes;

export default class extends Component {
  static childContextTypes = {
    target: string,
    viewWidth: number,
    navPop: func,
    navPush: func,
    openModal: func,
    saveState: func,
    openSecondary: func,
    popSecondary: func,
  }
  static propTypes = {
    target: string,
    children: element,
  }
  getChildContext() {
    const {
      target,
      navPop,
      navPush,
      saveState,
      openSecondary,
      popSecondary,
      openModal,
      viewWidth,
    } = this.props;
    return {
      target,
      viewWidth,
      navPop,
      navPush,
      saveState,
      openSecondary,
      popSecondary,
      openModal,
    };
  }
  render() {
    const { children } = this.props;
    return children;
  }
}
