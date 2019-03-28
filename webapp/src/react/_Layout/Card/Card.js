import React from 'react';
import { connect } from 'react-redux';

import * as navigationActions from 'src/redux/navigation/navigationActions';
import useNav from 'src/react/_hooks/useNav';
import Modal from 'src/react/_Layout/modal/Modal';

import Breadcrumbs from 'src/react/_components/Breadcrumbs/Breadcrumbs';
import Button from 'src/react/_components/Button/Button';

import SW from './Card.swiss';

export default connect()(Card);

function Card({ children, left, isOverlay, isUnderlay, dispatch }) {
  const nav = useNav();
  const handleClick = () => {
    if (isUnderlay) {
      dispatch(navigationActions.focus(nav.side));
    }
  };
  const handleClose = () => {
    nav.set('right', null);
  };
  return (
    <SW.Wrapper
      width={nav.width}
      left={Math.round(left)}
      isOverlay={isOverlay}
      isUnderlay={isUnderlay}
      onClick={handleClick}
    >
      <SW.Header>
        <Breadcrumbs side={nav.side} />
        <SW.Actions>
          {nav.side !== 'left' && (
            <Button
              onClick={nav.toggleLock}
              icon={nav.isLocked ? 'Pin' : 'Pin'}
              selected={nav.isLocked}
            />
          )}
          {nav.side !== 'left' && (
            <SW.Button
              onClick={handleClose}
              icon="Cross"
              isLocked={nav.isLocked}
            />
          )}
        </SW.Actions>
      </SW.Header>
      {children}
      <Modal side={nav.side} />
    </SW.Wrapper>
  );
}
