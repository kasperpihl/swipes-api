import React, { useContext } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { NavContext } from './NavProvider';

export default function withNav(WrappedComponent) {
  function WithNav(props) {
    const nav = useContext(NavContext);
    return <WrappedComponent {...props} nav={nav} />;
  }
  hoistNonReactStatics(WithNav, WrappedComponent);
  return WithNav;
}
