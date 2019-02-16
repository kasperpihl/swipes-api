import React from 'react';
import SW from './SideHeader.swiss';

export default function SideHeader({ title, smallTitle, subtitle }) {
  return (
    <SW.Wrapper>
      <SW.TitleWrapper>
        <SW.BigNumber>{title}</SW.BigNumber>
        {smallTitle}
      </SW.TitleWrapper>
      <SW.Subtitle>{subtitle}</SW.Subtitle>
    </SW.Wrapper>
  );
}
