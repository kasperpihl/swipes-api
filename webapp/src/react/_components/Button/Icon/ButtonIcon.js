import React from 'react';
import SW from './ButtonIcon.swiss';

export default function ButtonIcon(props) {
  let { icon, status } = props;

  switch (status) {
    case 'Standard': {
      if (!icon) {
        return null;
      }
      break;
    }
    case 'Loading':
      return <SW.LoaderCircle />;
    case 'Error':
      icon = 'Close';
      break;
    case 'Success':
      icon = 'ChecklistCheckmark';
      break;
    default:
      break;
  }
  return (
    <SW.IconWrapper>
      <SW.Icon icon={icon} />
    </SW.IconWrapper>
  );
}
