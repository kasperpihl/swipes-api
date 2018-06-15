import React from 'react';
import { styleElement } from 'swiss-react';
import Icon from 'Icon';
import styles from './CompatibleButton.swiss';

const ATag = styleElement('div', styles.ATag);

const CompatibleButton = (props) => {
  const {
    loading,
    error,
    success,
    title,
    onClick
  } = props;

  return (
    <ATag onClick={onClick}>
      {
        loading ? (
          <Icon icon="loader" width="12" height="12" />
        ) : (
          title
        )
      }
    </ATag>
  );
};

export default CompatibleButton;
