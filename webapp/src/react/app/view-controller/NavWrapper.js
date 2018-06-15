import React, { Component } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import PropTypes from 'prop-types';

const { string, func, number } = PropTypes;

const DEFAULT_MAX_WIDTH = 800;

const wrap = (ComponentToWrap) => {
  class NavWrapper extends Component {
    static contextTypes = {
      target: string,
      viewWidth: number,
      navPop: func,
      navPush: func,
      saveState: func,
      openSecondary: func,
      popSecondary: func,
      openModal: func,
    }
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
  hoistNonReactStatics(NavWrapper, ComponentToWrap);
  return NavWrapper;
}

export default wrap;
