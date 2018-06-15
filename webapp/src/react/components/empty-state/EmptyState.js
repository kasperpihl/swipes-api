import React from 'react';
import { styleElement } from 'swiss-react';
import styles from './EmptyState.swiss';

const Wrapper = styleElement('div', styles.Wrapper);

export default (props) => {
  return (
    <Wrapper />
  );
};