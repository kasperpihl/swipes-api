import React from 'react';
import { styleElement } from 'react-swiss';
// import styles from './ChangeCyclePopup.swiss';

const styles = {
  Wrapper: {}
};

const Wrapper = styleElement('div', styles.Wrapper);

export default (props) => {
  return (
    <Wrapper>I am the popup</Wrapper>
  );
};