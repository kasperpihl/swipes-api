import React, { Component, PropTypes } from 'react';
// import { map, list } from 'react-immutable-proptypes';

class ContextWrapper extends Component {
  getChildContext() {
    const { target } = this.props;
    return { target };
  }
  render() {
    const { children } = this.props;
    return children;
  }
}

export default ContextWrapper;

const { string, element } = PropTypes;

ContextWrapper.childContextTypes = {
  target: string,
};
ContextWrapper.propTypes = {
  target: string,
  children: element,
};
