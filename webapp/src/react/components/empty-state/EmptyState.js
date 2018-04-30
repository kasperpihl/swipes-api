import React from 'react';
import { styleElement } from 'react-swiss';
import styles from './EmptyState.swiss';

const Wrapper = styleElement('div', styles.Wrapper);

export default (props) => {
  return (
    <Wrapper />
  );
};