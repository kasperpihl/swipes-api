import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
const { string } = PropTypes;

const wrap = (ComponentToWrap) => {
  class GetTarget extends Component {
    render() {
      const { target } = this.context;
      // what we do is basically rendering `ComponentToWrap`
      // with an added `theme` prop, like a hook
      return (
        <ComponentToWrap {...this.props} target={target} />
      )
    }
  }
  GetTarget.contextTypes = {
    target: string,
  };
  return GetTarget;
}

export default wrap;
