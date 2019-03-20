import React from 'react';
import Spacing from '_shared/Spacing/Spacing';
import SW from './SideHeader.swiss';

export default function SideHeader({ title, smallTitle, subtitle }) {
  return (
    <SW.Wrapper>
      <SW.TitleWrapper>
        <SW.BigNumber>{title}</SW.BigNumber>
        <SW.SmallNumber>{smallTitle}</SW.SmallNumber>
      </SW.TitleWrapper>
      <Spacing height={8}/>
      <SW.Subtitle>{subtitle}</SW.Subtitle>
    </SW.Wrapper>
  );
}
