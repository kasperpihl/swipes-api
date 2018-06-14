import React from 'react';
import SW from './CompatibleCard.swiss';

const CompatibleCard = ({ children }) => {

  return (
    <SW.Wrapper>
      <SW.Card>
        {children}
      </SW.Card>
    </SW.Wrapper>
  );
};

export default CompatibleCard;
