import React from 'react';
import SW from './SideHeader.swiss';

export default function SideHeader({ title, smallTitle, subtitle }) {
  return (
    <SW.Wrapper>
      <SW.TitleWrapper>
        <SW.BigNumber>{title}</SW.BigNumber>
        <SW.SmallNumber>{smallTitle}</SW.SmallNumber>
      </SW.TitleWrapper>
      <SW.Subtitle>{subtitle}</SW.Subtitle>
    </SW.Wrapper>
  );
}
