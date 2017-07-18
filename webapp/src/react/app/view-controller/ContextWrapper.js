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
    } = this.props;
    return {
      target,
      navPop,
      navPush,
      saveState,
      openSecondary,
      popSecondary,
    };
  }
  render() {
    const { children } = this.props;
    return children;
  }
}

export default ContextWrapper;

const { string, element, func } = PropTypes;

ContextWrapper.childContextTypes = {
  target: string,
  navPop: func,
  navPush: func,
  saveState: func,
  openSecondary: func,
  popSecondary: func,
};
ContextWrapper.propTypes = {
  target: string,
  children: element,
};
