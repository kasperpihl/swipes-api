import React from 'react';
import { styleElement } from 'react-swiss';
import styles from './CompatibleCard.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Card = styleElement('div', styles.Card);

const CompatibleCard = ({ children }) => {

  return (
    <Wrapper>
      <Card>
        {children}
      </Card>
    </Wrapper>
  );
};

export default CompatibleCard;
