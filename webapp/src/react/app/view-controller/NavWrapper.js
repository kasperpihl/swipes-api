import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
const { string, func } = PropTypes;

const wrap = (ComponentToWrap) => {
  class NavWrapper extends Component {
    render() {
      const {
        target,
        navPop,
        navPush,
        saveState,
        openSecondary,
        popSecondary,
      } = this.context;
      // what we do is basically rendering `ComponentToWrap`
      // with an added `theme` prop, like a hook
      return (
        <ComponentToWrap
          {...this.props}
          target={target}
          navPop={navPop}
          navPush={navPush}
          saveState={saveState}
          openSecondary={openSecondary}
          popSecondary={popSecondary}
        />
      )
    }
  }
  NavWrapper.contextTypes = {
    target: string,
    navPop: func,
    navPush: func,
    saveState: func,
    openSecondary: func,
    popSecondary: func,
  };
  return NavWrapper;
}

export default wrap;
