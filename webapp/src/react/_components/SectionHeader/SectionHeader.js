import React from 'react';
import SW from './SectionHeader.swiss';

export default function SectionHeader({ children, ...rest }) {
  return <SW.Wrapper {...rest}>{children}</SW.Wrapper>;
}
