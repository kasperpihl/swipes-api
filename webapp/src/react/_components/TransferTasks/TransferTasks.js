import React from 'react';

import Spacing from '_shared/Spacing/Spacing';
import Button from '_shared/Button/Button';

import SW from './TransferTasks.swiss';

export default function TransferTasks({
  isPrevWeek,
  isThisWeek,
  isNextWeek,
  handleClick
}) {
  let title = '';
  let subtitle = '';
  let buttonTitle = 'Move tasks';
  let shouldShow = true;
  if (isPrevWeek) {
    title = 'Plan completed';
    subtitle = 'Move remaining tasks to current week?';
  } else if (isThisWeek) {
    title = 'Plan next week';
    subtitle =
      'Get a great start on monday and plan your next week already now.';
    buttonTitle = 'Go to next week';
  } else if (isNextWeek) {
    title = 'Plan next week';
    subtitle = 'Move remaining tasks from previous week?';
  } else {
    shouldShow = false;
  }

  return (
    <SW.Wrapper show={shouldShow}>
      <SW.Title>{title}</SW.Title>
      <Spacing height={12} />
      <SW.Subtitle>{subtitle}</SW.Subtitle>
      <Spacing height={50} />
      <Button title={buttonTitle} icon="Move" onClick={handleClick} />
    </SW.Wrapper>
  );
}
