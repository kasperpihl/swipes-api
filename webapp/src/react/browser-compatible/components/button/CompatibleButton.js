import React from 'react';
import Icon from 'Icon';
import SW from './CompatibleButton.swiss';

const CompatibleButton = (props) => {
  const {
    loading,
    error,
    success,
    title,
    onClick
  } = props;

  return (
    <SW.ATag onClick={onClick}>
      {
        loading ? (
          <Icon icon="loader" width="12" height="12" />
        ) : (
          title
        )
      }
    </SW.ATag>
  );
};

export default CompatibleButton;
