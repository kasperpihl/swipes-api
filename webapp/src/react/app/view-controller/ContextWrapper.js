import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';

class ContextWrapper extends Component {
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

export default ContextWrapper;

const { string, element, func, number } = PropTypes;

ContextWrapper.childContextTypes = {
  target: string,
  viewWidth: number,
  navPop: func,
  navPush: func,
  openModal: func,
  saveState: func,
  openSecondary: func,
  popSecondary: func,
};
ContextWrapper.propTypes = {
  target: string,
  children: element,
};
