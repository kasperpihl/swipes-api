import React from 'react';
import { styleElement } from 'react-swiss';
import styles from './CompatibleCard.swiss';

const CardWrapper = styleElement('div', styles.CardWrapper);
const Card = styleElement('div', styles.Card);

const CompatibleCard = ({ children }) => {

  return (
    <CardWrapper>
      <Card>
        {children}
      </Card>
    </CardWrapper>
  );
};

export default CompatibleCard;
