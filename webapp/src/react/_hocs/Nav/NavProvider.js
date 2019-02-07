import React, { createContext, useMemo } from 'react';
import { connect } from 'react-redux';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import * as mainActions from 'src/redux/main/mainActions';

export const NavContext = createContext();

// Just get access to dispatch!
export default connect()(NavProvider);

function NavProvider({ side, width, isLocked, children, dispatch }) {
  const nav = useMemo(() => {
    const fire = actionFunc => (...params) => {
      dispatch(actionFunc(side, ...params));
    };
    return {
      push: fire(navigationActions.push),
      pop: fire(navigationActions.pop),
      openRight: fire(navigationActions.openSecondary),
      openModal: fire(mainActions.modal),
      saveState: fire(navigationActions.saveState),
      set: fire(navigationActions.set),
      lock: fire(navigationActions.toggleLock),
      width,
      isLocked,
      side
    };
  }, [side, width, isLocked]);
  return <NavContext.Provider value={nav}>{children}</NavContext.Provider>;
}
