import React from 'react';
import SW from './Card.swiss';

const Card = ({ children }) => {
  return (
    <SW.Wrapper>
      <SW.Card>{children}</SW.Card>
    </SW.Wrapper>
  );
};

export default Card;
