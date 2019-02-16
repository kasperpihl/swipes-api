import React from 'react';
import SW from './PlanSideAlert.swiss';

export default function PlanSideAlert({ type, title, children }) {
  return (
    <SW.Wrapper type={type}>
      <SW.Title>{title}</SW.Title>
      {children}
    </SW.Wrapper>
  );
}
