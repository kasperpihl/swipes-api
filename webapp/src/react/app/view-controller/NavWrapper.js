import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
const { string, func, number } = PropTypes;

const DEFAULT_MAX_WIDTH = 800;

const wrap = (ComponentToWrap) => {
  class NavWrapper extends Component {
    static maxWidth() {
      if(typeof ComponentToWrap.maxWidth === 'function') {
        return ComponentToWrap.maxWidth();
      }
      return DEFAULT_MAX_WIDTH;
    }
    static sizes() {
      if(typeof ComponentToWrap.sizes === 'function') {
        return ComponentToWrap.sizes();
      }
      return [];
    }
    static fullscreen() {
      if(typeof ComponentToWrap.fullscreen === 'function') {
        return ComponentToWrap.fullscreen();
      }
      return false;
    }
    render() {
      const {
        target,
        navPop,
        navPush,
        saveState,
        openSecondary,
        popSecondary,
        openModal,
        viewWidth,
      } = this.context;
      // what we do is basically rendering `ComponentToWrap`
      // with an added `theme` prop, like a hook
      return (
        <ComponentToWrap
          {...this.props}
          target={target}
          viewWidth={viewWidth}
          navPop={navPop}
          navPush={navPush}
          saveState={saveState}
          openSecondary={openSecondary}
          popSecondary={popSecondary}
          openModal={openModal}
        />
      )
    }
  }
  NavWrapper.contextTypes = {
    target: string,
    viewWidth: number,
    navPop: func,
    navPush: func,
    saveState: func,
    openSecondary: func,
    popSecondary: func,
    openModal: func,
  };
  return NavWrapper;
}

export default wrap;
