import React from 'react';
import Button from 'src/react/_components/Button/Button';
import { connect } from 'react-redux';
import withNav from 'src/react/_hocs/Nav/withNav';
import Breadcrumbs from 'src/react/_components/Breadcrumbs/Breadcrumbs';
import Modal from 'src/react/_Layout/modal/Modal';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import SW from './Card.swiss';

export default connect()(withNav(Card));

function Card({ nav, children, top, left, isOverlay, isUnderlay, dispatch }) {
  const handleClick = () => {
    if (isUnderlay) {
      dispatch(navigationActions.setOnTop(nav.side));
    }
  };
  return (
    <SW.Wrapper
      width={nav.width}
      left={left}
      isOverlay={isOverlay}
      isUnderlay={isUnderlay}
      onClick={handleClick}
    >
      <SW.Header>
        <Breadcrumbs side={nav.side} />
        <SW.Actions>
          {nav.side !== 'left' && !nav.isLocked && (
            <Button.Standard onClick={nav.pop} icon="CloseThick" />
          )}
          {nav.side !== 'left' && (
            <Button.Standard
              onClick={nav.lock}
              icon={nav.isLocked ? 'WindowLock' : 'WindowUnlock'}
            />
          )}
        </SW.Actions>
      </SW.Header>
      {children}
      <Modal side={nav.side} />
    </SW.Wrapper>
  );
}
