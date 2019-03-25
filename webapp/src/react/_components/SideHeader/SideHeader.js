import React from 'react';
import Spacing from '_shared/Spacing/Spacing';
import SW from './SideHeader.swiss';

export default function SideHeader({ largeNumber, smallNumber, subtitle }) {
  return (
    <SW.Wrapper>
      <SW.BigNumber>{largeNumber}</SW.BigNumber>
      <SW.TitleWrapper>
        <SW.SmallNumber>{smallNumber}</SW.SmallNumber>
        <Spacing height={6} />
        <SW.Subtitle>{subtitle}</SW.Subtitle>
      </SW.TitleWrapper>
    </SW.Wrapper>
  );
}
