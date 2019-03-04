import React from 'react';
import SW from './PlanAlert.swiss';

export default function PlanAlert({ type, title, message }) {
  return (
    <SW.ProvideContext type={type}>
      <SW.Wrapper>
        <SW.Title>{title}</SW.Title>
        <SW.Message>{message}</SW.Message>
      </SW.Wrapper>
    </SW.ProvideContext>
  );
}
