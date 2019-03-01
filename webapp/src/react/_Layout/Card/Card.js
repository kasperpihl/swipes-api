import React from 'react';
import Button from 'src/react/_components/Button/Button';
import { connect } from 'react-redux';
import useNav from 'src/react/_hooks/useNav';
import Breadcrumbs from 'src/react/_components/Breadcrumbs/Breadcrumbs';
import Modal from 'src/react/_Layout/modal/Modal';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import SW from './Card.swiss';

export default connect()(Card);

function Card({ children, top, left, isOverlay, isUnderlay, dispatch }) {
  const nav = useNav();
  const handleClick = () => {
    if (isUnderlay) {
      dispatch(navigationActions.focus(nav.side));
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
          {nav.side !== 'left' && (
            <Button
              onClick={nav.toggleLock}
              icon={nav.isLocked ? 'Pin' : 'Pin'}
            />
          )}
          {nav.side !== 'left' && (
            <SW.Button onClick={nav.pop} icon="Cross" isLocked={nav.isLocked} />
          )}
        </SW.Actions>
      </SW.Header>
      {children}
      <Modal side={nav.side} />
    </SW.Wrapper>
  );
}
